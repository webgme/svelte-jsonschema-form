<script context="module" lang="ts">
  import { getContext, setContext } from "svelte";
  import * as controls from "./controls";

  const controlNames = Object.keys(controls);
  const ControlPropsContextKey = Symbol("control-props");

  function useConst(schema: JSONSchema7 | undefined) {
    return (schema != null) && !isBoolean(schema) && ("const" in schema);
  }

  function useAnyOf(schema: JSONSchema7 | undefined) {
    return (schema?.anyOf != null) && (schema?.properties == null);
  }

  export function getSingleSchemaType(schema: JSONSchema7 | undefined) {
    const type = useConst(schema) ? "const"
      : useAnyOf(schema) ? "anyOf"
      : schema?.type;
    return (Array.isArray(type) ? type[0] : type) ?? "object";
  }

  export function setControlProps(props: Record<string, any>) {
    const context = Object.keys(props).reduce((controlsProps, name) => {
      const [controlName, propName] = name.split('$', 2);
      if ((controlNames.includes(controlName)) && (propName != null)) {
        (controlsProps[controlName] ??= {})[propName] = props[name];
      }
      return controlsProps;
    }, {} as { [control: string]: { [prop: string]: any } });
    return setContext(ControlPropsContextKey, context);
  }

  export function getControlProps() {
    return getContext<{[control: string]: Record<string, any>}>(ControlPropsContextKey);
  }
</script>

<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import type UISchema from "./UISchema";
  import { isBoolean } from "./utilities";

  export let schema: JSONSchema7 | undefined;
  export let data: any = undefined;
  export let uischema: UISchema = {};
  export let force: boolean = false;

  const allControlProps = getControlProps();
  let control: any;
  let controlProps: Record<string, any> = {};

  $: updateControlType(schema);

  function updateControlType(schema: JSONSchema7 | undefined) {
    const singleType = getSingleSchemaType(schema);
    const updatedControl = controls[singleType as keyof typeof controls] as any;
    if (updatedControl != control) {
      control = updatedControl;
      controlProps = allControlProps[singleType];
    }
  }
</script>

<svelte:component this={control} {...controlProps} {...schema} bind:data {uischema} {force} />