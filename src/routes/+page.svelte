<script lang="ts">
  import { tick } from 'svelte';
  import TabBar from "@smui/tab-bar"
  import Tab, { Label } from "@smui/tab"
  import IconButton from '@smui/icon-button';
  import Button, { Label as BtnLabel } from "@smui/button"
  import Textfield from '@smui/textfield';
  import Snackbar, { Label as SBLabel, Actions } from '@smui/snackbar';
  import SchemaForm, { type ValidationError } from "$lib";
  import schemas, { type TestSchema } from "../schemas";

  import type UISchema from "$lib/UISchema";

  let active = schemas[0];
  let schema: TestSchema["schema"];
  let uischema: UISchema;
  let data: TestSchema["data"];
  let schemaString = "";
  let uischemaString = "";
  let dataString = "";
  let validationError: ValidationError | null = null;

  let schemaForm: SchemaForm;
  let errorSnackbar: Snackbar;

  $: updateActive(active);
  $: setSchemaString(schema);
  $: setUISchemaString(uischema);
  $: setDataString(data);
  $: if (validationError != null) errorSnackbar.open();

  async function setSchemaString(schema: TestSchema["schema"]) {
    await tick();
    schemaString = JSON.stringify(schema, null, 2);
  }

  async function setUISchemaString(uischema: UISchema) {
    await tick();
    uischemaString = JSON.stringify(uischema, null, 2);
  }

  async function setDataString(data: TestSchema["data"]) {
    await tick();
    dataString = JSON.stringify(data, null, 2);
  }

  function updateActive(active: TestSchema) {
    schema = structuredClone(active.schema);
    uischema = structuredClone(active.uischema) ?? {};
    data = structuredClone(active.data);
  }

  function setSchema() {
    if (schemaString.trim() === "") {
      schema = true;
    }
    else try {
      schema = JSON.parse(schemaString);
    } catch (error) {
      console.error(error);
    }
  }

  function setUISchema() {
    if (uischemaString.trim() === "") {
      uischema = {};
    }
    else try {
      uischema = JSON.parse(uischemaString);
    } catch (error) {
      console.error(error);
    }
  }

  function setData() {
    if (dataString.trim() === "") {
      data = {};
    }
    else try {
      data = JSON.parse(dataString);
    } catch (error) {
      console.error(error);
    }
  }

  function download() {
    try {
      schemaForm.download();
    } catch (error) {
      validationError = error as ValidationError;
    }
  }
</script>

<section>
  <TabBar tabs={schemas} let:tab bind:active id="schema-select">
    <Tab {tab}>
      <Label>{tab.name}</Label>
    </Tab>
  </TabBar>
  <SchemaForm {schema} {uischema} bind:data bind:this={schemaForm}>
    <Button on:click={download} type="button" variant="raised">
      <BtnLabel>Download</BtnLabel>
    </Button>
  </SchemaForm>

  <Snackbar class="schema-error" bind:this={errorSnackbar}>
    <SBLabel>
      {#if validationError}
        {validationError.message}
        <ul>
          {#each validationError.errors as error}
            <li>{error.message}</li>
          {/each}
        </ul>
      {:else}
        Unknown error
      {/if}
    </SBLabel>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</section>

<hr id="divider" />

<section id="debug">
  <Textfield
    textarea
    bind:value={schemaString}
    on:change={setSchema}
    label="Schema"
  />

  <Textfield
    textarea
    bind:value={uischemaString}
    on:change={setUISchema}
    label="UI Schema"
  />

  <Textfield
    textarea
    bind:value={dataString}
    on:change={setData}
    label="Data"
  />
</section>

<style>
  :global(#schema-select) {
    margin-bottom: 32px;
  }

  #divider {
    margin-top: 3rem;
  }

  #debug {
    display: flex;
    justify-content: space-between;
    min-height: 500px;
  }

  #debug > :global(*) {
    margin: 8px;
    flex: 1;
  }
</style>
