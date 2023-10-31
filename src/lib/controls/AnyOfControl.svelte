<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import type UISchema from "$lib/UISchema";
  import deepEquals from "fast-deep-equal";
  import { tick } from 'svelte';
  import { isObjectSchema, omit, getLabel } from "$lib/utilities";
  import Paper, { Title, Content } from "@smui/paper";
  import Select, { Option } from '@smui/select';
  import Control from "../Control.svelte";
  import ObjectProps from "./ObjectProps.svelte";

  export let type: JSONSchema7['type'] = undefined;
  export let data: any;
  export let title: string | undefined = undefined;
  export let uischema: UISchema = {};
  export let anyOf: JSONSchema7Definition[] = [];
  export let isRequired: boolean | undefined = undefined;
  export let force: boolean = false;

  const keys = new WeakMap<JSONSchema7, string>();
  let schemas: JSONSchema7[] = [];
  let selected: JSONSchema7 | null = null;
  let selectedProps: string[] | undefined = [];

  $: typeSchema = { type: selected?.type ?? type };
  $: updateSchemas(anyOf);
  $: resetSelected(schemas);
  $: resetData(selected);

  function getKey(schema: JSONSchema7) {
    return keys.get(schema) ?? "";
  }

  function updateSchemas(anyOf: JSONSchema7Definition[]) {
    const filtered = anyOf.filter(schema => (schema !== true) && (schema !== false)) as JSONSchema7[];
    if (!deepEquals(schemas, filtered)) {
      schemas = filtered;
      const timestamp = Date.now();
      schemas.forEach((schema, index) => {
        if (!keys.has(schema)) {
          keys.set(schema, `${timestamp}#${index}`);
        }
      });
    }
  }

  function resetSelected(schemas: JSONSchema7[]) {
    if ((selected == null) ? force : !schemas.includes(selected)) {
      selected = force ? schemas[0] : null;
    }
  }

  async function resetData(selected: JSONSchema7 | null) {
    await tick();
    const isObj = isObjectSchema(typeSchema);
    if (data != null) {
      if (selectedProps) {
        const omitted = omit(data, selectedProps);
        // make sure it's changed (to prevent infinite loop)
        if (Object.keys(data).length != Object.keys(omitted).length) {
          data = omitted;
        }
      } else {
        data = undefined;
      }
    }
    else if (isObj && force) {
      data = {};
    }
    selectedProps = isObj ? Object.keys(selected?.properties ?? {}) : undefined;
  }
</script>

<Paper variant="unelevated" class="jsonschema-form-control control-anyof">
  <Title>
    <Select 
      variant="outlined"
      key={getKey}
      class="control-anyof-select"
      label={title}
      required={isRequired}
      menu$class="control-anyof-menu"
      menu$portal
      bind:value={selected}
    >
      {#if !force}
        <Option value={null} />
      {/if}
      {#each schemas as schema, index (schema)}
        <Option value={schema}>{ getLabel(schema, index) }</Option>
      {/each}
    </Select>
  </Title>
  <Content class="jsonschema-form-controls">
    {#if selected != null}
      {#if isObjectSchema(typeSchema)}
        <ObjectProps {...selected} bind:data {uischema} />
      {:else}
        <Control schema={selected} bind:data {uischema} force />
      {/if}
    {/if}
  </Content>
</Paper>
