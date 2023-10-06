<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import UISchema from "$lib/UISchema";
  import Control from "../Control.svelte";
  import AnyOfControl from "./AnyOfControl.svelte";
  import { isEmpty } from "$lib/utilities";

  export let data: { [prop: string]: any } | undefined;
  export let title: string | undefined = undefined;
  export let uischema: UISchema = {};
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;

  let items = [] as { name: string, schema: JSONSchema7, uischema: UISchema }[];
  let values: { [prop: string]: any } | undefined;

  $: uiOptions = UISchema.Options.get(uischema);
  $: ignoreEmpty = $uiOptions.ignoreEmpty ?? false;
  $: updateItems(properties, uischema);
  $: updateValues(data, ignoreEmpty);
  $: updateData(values);

  function updateItems(properties: { [prop: string]: any } | undefined, uischema: UISchema) {
    items = (properties == null) ? [] :
      Object.entries(properties).map(([name, props]) => {
        const schema = {title: name, ...props, isRequired: required.includes(name)};
        return { name, schema, uischema: uischema?.[name] };
      });
  }

  function updateValues(data: { [prop: string]: any } | undefined, ignoreEmpty: boolean) {
    if (ignoreEmpty && (data == null) && ((values == null) || !isEmpty(values))) {
      values = {};
    }
    else if (values != data) {
      values = data;
    }
  }

  function updateData(values: { [prop: string]: any } | undefined) {
    if (ignoreEmpty && (values != null) && isEmpty(values) && (data != null)) {
      data = undefined;
    }
    else {
      data = values;
    }
  }
</script>

{#if !!values}
  {#each items as { name, schema, uischema } (name)}
    <Control {schema} bind:data={values[name]} {uischema} />
  {/each}
{/if}
{#if (anyOf != null)}
  <AnyOfControl {anyOf} {title} type={'object'} bind:data {uischema} />
{/if}
