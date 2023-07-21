<script lang="ts">
  import type { JSONSchema7TypeName } from "json-schema";
  import * as controls from "./controls";

  export let type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined = undefined;
  export let data: any = undefined;

  let control: any;

  $: {
    const singleType = (Array.isArray(type) ? type[0] : type) ?? "object";
    control = controls[singleType as keyof typeof controls] as any;
  };
</script>

<svelte:component this={control} {...$$props} bind:data={data} />
