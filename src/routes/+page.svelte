<script lang="ts">
  import SchemaFrom from "$lib/SchemaForm.svelte";
  import type { JSONSchema7 } from "json-schema";
  import testSchema from "../schemas/nested/schema.json";
  import testData from "../schemas/nested/data.json";

  const schema = testSchema as JSONSchema7;
  let data = testData;
</script>

<SchemaFrom {schema} bind:data={data} />

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
