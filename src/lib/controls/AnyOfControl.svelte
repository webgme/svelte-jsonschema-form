<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import Validator from "$lib/Validator";
  import UISchema from "$lib/UISchema";
  import deepEquals from "fast-deep-equal";
  import { isObjectSchema, omit, getLabel, isEmpty } from "$lib/utilities";
  import Paper, { Title, Content } from "@smui/paper";
  import Select, { Option } from '@smui/select';
  import Control from "../Control.svelte";
  import ObjectProps from "./ObjectProps.svelte";
  import { tick } from "svelte";

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

  $: uiOptions = UISchema.Options.get(uischema);
  $: updateSchemas(anyOf);
  $: resetSelected(schemas);

  function isObjSchema(schema: JSONSchema7 | null = selected) {
    return isObjectSchema({ type: schema?.type ?? type });
  }

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

  async function setSelected(value: JSONSchema7 | null) {
    if (selected !== value) {
      let newData = data;
      if (isObjSchema(value) && (value != null)) {
        if ((selected != null) && isObjSchema() && !isEmpty(data ?? {})) {
          const selectedProps = Object.keys(selected?.properties ?? {});
          newData = omit(data, selectedProps, { keepUnchanged: true });
        }
        else if ((data == null) || !isEmpty(data)) {
          newData = {};
        }
      }
      else {
        newData = undefined;
      }
      if (newData != data) {
        data = newData;
      }
      selected = value;
    }
  }

  function resetSelected(schemas: JSONSchema7[]) {
    let newSelected = schemas.find(schema => Validator.validate(schema, data)) ?? null;
    if (force && (newSelected == null)) {
      newSelected = schemas[0];
    }
    if (newSelected !== selected) {
      selected = newSelected;
    }
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
      disabled={$uiOptions.readonly}
      menu$class="control-anyof-menu"
      menu$portal
      value={selected}
      on:SMUISelect:change={(event) => setSelected(event.detail.value)}
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
      {#if isObjSchema()}
        <ObjectProps {...selected} bind:data {uischema} />
      {:else}
        <Control schema={selected} bind:data {uischema} force />
      {/if}
    {/if}
  </Content>
</Paper>
