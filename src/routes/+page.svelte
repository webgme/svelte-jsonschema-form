<script lang="ts">
  import SchemaForm from "$lib";
  import { numbers as test } from "../schemas";

  let { schema, data } = test;
</script>

<SchemaForm {schema} bind:data={data} />

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
