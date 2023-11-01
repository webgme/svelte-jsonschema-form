<script lang="ts">
  import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";
  import type UISchema from "./UISchema";
  import * as controls from "./controls";

  export let schema: JSONSchema7 | undefined;
  export let data: any = undefined;
  export let uischema: UISchema = {};
  export let force: boolean = false;

  let control: any;

  $: updateControlType(schema);

  function useConst(schema: JSONSchema7 | undefined) {
    return (schema != null) && ("const" in schema);
  }

  function useAnyOf(schema: JSONSchema7 | undefined) {
    return (schema != null) && (("anyOf" in schema) && !("properties" in schema));
  }

  function updateControlType(schema: JSONSchema7 | undefined) {
    const type = useConst(schema) ? "const"
      : useAnyOf(schema) ? "anyOf"
      : schema?.type;
    const singleType = (Array.isArray(type) ? type[0] : type) ?? "object";
    control = controls[singleType as keyof typeof controls] as any;
  }
</script>

<svelte:component this={control} {...schema} bind:data {uischema} {force} />