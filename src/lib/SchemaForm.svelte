<script lang="ts">
  import 'core-js/actual/structured-clone';
  import type { JSONSchema7 } from "json-schema";
  import JsonSchemaDereferencer from "@json-schema-tools/dereferencer";
  import Control from "./Control.svelte"; 

  export let schema: JSONSchema7 = {};
  export let data: { [prop: string]: any } = {};


  $: dereferencing = new JsonSchemaDereferencer(
    structuredClone(schema),
    { mutate: true }
  ).resolve();
</script>

{#await dereferencing}
  <div>dereferencing...</div>
{:then dereferenced}
  <Control {...dereferenced} bind:data={data} />
{:catch error}
  <div class="error">ERROR: {error.message}</div>
{/await}
