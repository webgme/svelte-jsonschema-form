<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import type UISchema from "./UISchema";
  import { isBoolean } from "./utilities";
  import * as controls from "./controls";

  export let schema: JSONSchema7 | undefined;
  export let data: any = undefined;
  export let uischema: UISchema = {};
  export let force: boolean = false;

  let control: any;

  $: updateControlType(schema);

  function useConst(schema: JSONSchema7 | undefined) {
    return (schema != null) && !isBoolean(schema) && ("const" in schema);
  }

  function useAnyOf(schema: JSONSchema7 | undefined) {
    return (schema?.anyOf != null) && (schema?.properties == null);
  }

  function updateControlType(schema: JSONSchema7 | undefined) {
    const type = useConst(schema) ? "const"
      : useAnyOf(schema) ? "anyOf"
      : schema?.type;
    const singleType = (Array.isArray(type) ? type[0] : type) ?? "object";
    const updatedControl = controls[singleType as keyof typeof controls] as any;
    if (updatedControl != control) {
      control = updatedControl;
    }
  }
</script>

<svelte:component this={control} {...schema} bind:data {uischema} {force} />