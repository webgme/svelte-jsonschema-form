<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import { isObjectSchema, isArraySchema } from "$lib/utilities";
  import Paper, { Title, Content } from "@smui/paper";
  import Select, { Option } from '@smui/select';
  import Control from "../Control.svelte";
  import ObjectProps from "./ObjectProps.svelte";

  export let type: JSONSchema7['type'] = undefined;
  export let data: any;
  export let anyOf: JSONSchema7Definition[] = [];

  const keys = new WeakMap<JSONSchema7, string>();
  let schemas: JSONSchema7[] = [];
  let selected: JSONSchema7 | undefined = undefined;

  $: typeSchema = { type: selected?.type ?? type };
  $: updateSchemas(anyOf);
  $: resetSelected(schemas);
  $: updateData(selected);

  function getKey(schema: JSONSchema7) {
    return keys.get(schema) ?? "";
  }

  function updateSchemas(anyOf: JSONSchema7Definition[]) {
    schemas = anyOf.filter(schema => (schema !== true) && (schema !== false)) as JSONSchema7[];
    const timestamp = Date.now();
    schemas.forEach((schema, index) => {
      if (!keys.has(schema)) {
        keys.set(schema, `${timestamp}#${index}`);
      }
    });
  }

  function resetSelected(schemas: JSONSchema7[]) {
    if ((selected == null) || !schemas.includes(selected)) {
      selected = schemas[0];
    }
  }

  function updateData(selected: JSONSchema7 | undefined) {
    if (selected == null) {
      data = undefined;
    }
    else if (isObjectSchema(typeSchema)) {
      data = {};
    }
    else if (isArraySchema(typeSchema)) {
      data = [];
    }
    else {
      data = undefined;
    }
  }
</script>

<Paper variant="unelevated" class="control-anyof">
  <Title>
    <Select variant="outlined" key={getKey} bind:value={selected}>
      {#each schemas as schema, index (schema)}
        <Option value={schema}>{schema.title ?? `Option ${index + 1}` }</Option>
      {/each}
    </Select>
  </Title>
  {#if selected != null}
    {#if isObjectSchema(typeSchema)}
      <Paper variant="unelevated" class="jsonschema-form-control control-object">
        <ObjectProps {...selected} bind:data force />
      </Paper>
    {:else}
      <Control schema={selected} bind:data force />
    {/if}
  {/if}
</Paper>
