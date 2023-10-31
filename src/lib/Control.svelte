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

  function updateControlType(schema: JSONSchema7 | undefined) {
    const hasConst = (schema != null) && Object.hasOwn(schema, "const");
    const type = hasConst ? "const" : schema?.type;
    const singleType = (Array.isArray(type) ? type[0] : type) ?? "object";
    control = controls[singleType as keyof typeof controls] as any;
  }
</script>

<svelte:component this={control} {...schema} bind:data {uischema} {force} />