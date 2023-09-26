<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import type UISchema from "$lib/UISchema";
  import Control from "../Control.svelte";
  import AnyOfControl from "./AnyOfControl.svelte";

  export let data: { [prop: string]: any } | undefined;
  export let uischema: UISchema = {};
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;

  let items = [] as { name: string, schema: JSONSchema7, uischema: UISchema }[];

  $: updateItems(properties, uischema);

  function updateItems(properties: { [prop: string]: any } | undefined, uischema: UISchema) {
    items = (properties == null) ? [] :
      Object.entries(properties).map(([name, props]) => {
        const schema = {title: name, ...props, isRequired: required.includes(name)};
        return { name, schema, uischema: uischema?.[name] };
      });
  }
</script>

{#if !!data}
  {#each items as { name, schema, uischema } (name)}
    <Control {schema} bind:data={values[name]} {uischema} />
  {/each}
{/if}
{#if (anyOf != null)}
  <AnyOfControl {anyOf} type={'object'} bind:data {uischema} />
{/if}
