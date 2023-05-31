<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import Control from "./Control.svelte"; 

  export let schema: JSONSchema7 = {};
  // export let data: { [prop: string]: any } = {};
</script>

<Control {...schema}/>

<pre>{JSON.stringify(schema, null, 2)}</pre>