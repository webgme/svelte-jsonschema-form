<script lang="ts">
  import TabBar from "@smui/tab-bar"
  import Tab, { Label } from "@smui/tab"
  import SchemaForm from "$lib";
  import * as schemas from "../schemas";

  let schemaNames = Object.keys(schemas) as (keyof typeof schemas)[];
  let active = schemaNames[0];

  $: schema = schemas[active].schema;
  $: data = schemas[active].data;
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
  <div id="schema">
    <h2>Schema</h2>
    <pre>{JSON.stringify(schema, null, 2)}</pre>
  </div>

  <div id="data">
    <h2>Data</h2>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
</section>

<style>
  #divider {
    margin-top: 3rem;
  }

  #debug {
    display: flex;
    justify-content: space-between;
  }

  #debug > div {
    flex: 1;
  }
</style>
