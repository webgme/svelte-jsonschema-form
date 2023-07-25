<script lang="ts">
  import 'core-js/actual/structured-clone';
  import type { JSONSchema7 } from "json-schema";
  import JsonSchemaDereferencer from "@json-schema-tools/dereferencer";
  import mergeAllOf from "json-schema-merge-allof";
  import Control from "./Control.svelte"; 

  export let schema: JSONSchema7 = {};
  export let data: { [prop: string]: any } = {};

  /* A bit of a hack - When bulding the static test site, the dereferencer is still behind a
   * `.default` property for some reason. I'm guessing it has something to do with how modules are
   * imported during the svelte build process. When running in browser, it appears to be imported
   * properly (so `.default` is `undefined`).
   */
  const Dereferencer: typeof JsonSchemaDereferencer = (<any>JsonSchemaDereferencer).default ?? JsonSchemaDereferencer;

  $: dereferencing = new Dereferencer(
    mergeAllOf(structuredClone(schema)),
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
 