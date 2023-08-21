<script lang="ts">
  import "../theme/_custom.scss"
  import TabBar from "@smui/tab-bar"
  import Tab, { Label } from "@smui/tab"
  import IconButton from '@smui/icon-button';
  import Button, { Label as BtnLabel } from "@smui/button"
  import Textfield from '@smui/textfield';
  import Snackbar, { Label as SBLabel, Actions } from '@smui/snackbar';
  import SchemaForm, { type ValidationError } from "$lib";
  import schemas, { type TestSchema } from "../schemas";

  let active = schemas[0];
  let schema: TestSchema["schema"];
  let data: TestSchema["data"];
  let schemaString = "";
  let dataString = "";
  let validationError: ValidationError | null = null;

  let schemaForm: SchemaForm;
  let errorSnackbar: Snackbar;

  $: updateActive(active);
  $: setSchemaString(schema);
  $: setDataString(data);
  $: if (validationError != null) errorSnackbar.open();

  function setSchemaString(schema: TestSchema["schema"]) {
    schemaString = JSON.stringify(schema, null, 2);
  }

  function setDataString(data: TestSchema["data"]) {
    dataString = JSON.stringify(data, null, 2);
  }

  function updateActive(active: TestSchema) {
    schema = structuredClone(active.schema);
    data = structuredClone(active.data);
  }

  function setSchema() {
    try {
      schema = JSON.parse(schemaString);
    } catch (error) {
      console.error(error);
    }
  }

  function setData() {
    try {
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
  <SchemaForm {schema} bind:data bind:this={schemaForm}>
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
