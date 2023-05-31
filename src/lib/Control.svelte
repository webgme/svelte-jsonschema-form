<script lang="ts">
  import type { JSONSchema7TypeName } from "json-schema";
  import * as controls from "./controls";

  export let type: JSONSchema7TypeName | JSONSchema7TypeName[] = "object";
  // export let data: { [prop: string]: any } = {};

  let control: any;

  $: {
    const singleType = Array.isArray(type) ? type[0] : type;
    control = controls[singleType as keyof typeof controls] as any;
  };
</script>

<svelte:component this={control} {...$$props} />
