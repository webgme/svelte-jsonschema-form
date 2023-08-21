<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import Paper, { Title, Content } from "@smui/paper";
  import Select, { Option } from '@smui/select';
  import ObjectControl from "./ObjectControl.svelte";
  import Control from "../Control.svelte";

  export let type: string | string[] | undefined = undefined;
  export let data: any;
  export let anyOf: JSONSchema7Definition[] = [];

  const keys = new WeakMap<JSONSchema7, string>();
  let selected: JSONSchema7 | undefined = undefined;

  $: schemas = anyOf.filter(schema => (schema !== true) && (schema !== false)) as JSONSchema7[];
  $: {
    const timestamp = Date.now();
    schemas.forEach((schema, index) => {
      if (!keys.has(schema)) {
        keys.set(schema, `${timestamp}#${index}`);
      }
    });
    resetSelected();
  }
  $: isObjectType = (selected?.type ?? (Array.isArray(type) ? type[0] : type)) === "object";

  function getKey(schema: JSONSchema7) {
    return keys.get(schema) ?? "";
  }

  function resetSelected() {
    if ((selected == null) || !schemas.includes(selected)) {
      selected = schemas[0];
    }
  }
</script>

{#if isObjectType}
  <ObjectControl {...selected} bind:data>
    <Select variant="outlined" slot="title" key={getKey} bind:value={selected}>
      {#each schemas as schema, index (schema)}
        <Option value={schema}>{schema.title ?? `Option ${index + 1}` }</Option>
      {/each}
    </Select>
  </ObjectControl>
{:else}
  <Paper>
    <Title>
      <Select key={getKey} bind:value={selected}>
        {#each schemas as schema, index (schema)}
          <Option value={schema}>{schema.title ?? `Option ${index + 1}` }</Option>
        {/each}
      </Select>
    </Title>
    {#if selected != null}
      <Content>
        <Control {...selected} bind:data />
      </Content>
    {/if}
  </Paper>
{/if}
