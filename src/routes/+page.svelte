<script lang="ts">
  import TabBar from "@smui/tab-bar"
  import Tab, { Label } from "@smui/tab"
  import Textfield from '@smui/textfield';
  import SchemaForm from "$lib";
  import schemas, { type TestSchema } from "../schemas";

  let active = schemas[0];
  let schema: TestSchema["schema"];
  let data: TestSchema["data"];
  let schemaString = "";
  let dataString = "";

  $: updateActive(active);
  $: setSchemaString(schema);
  $: setDataString(data);

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
</script>

<section>
  <TabBar tabs={schemas} let:tab bind:active>
    <Tab {tab}>
      <Label>{tab.name}</Label>
    </Tab>
  </TabBar>
  <SchemaForm {schema} bind:data />
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
