<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import TabBar from "@smui/tab-bar"
  import Tab, { Label } from "@smui/tab"
  import Textfield from '@smui/textfield';
  import SchemaForm from "$lib";
  import * as schemas from "../schemas";

  let schemaNames = Object.keys(schemas) as (keyof typeof schemas)[];
  let active = schemaNames[0];
  let schemaString = "";
  let dataString = "";

  $: schema = structuredClone(schemas[active].schema);
  $: data = structuredClone(schemas[active].data);
  $: setSchemaString(schema);
  $: setDataString(data);

  function setSchemaString(schema: JSONSchema7) {
    schemaString = JSON.stringify(schema, null, 2);
  }

  function setDataString(data: any) {
    dataString = JSON.stringify(data, null, 2);
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
</script>

<section>
  <TabBar tabs={schemaNames} let:tab bind:active>
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  <SchemaForm {schema} bind:data={data} />
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
