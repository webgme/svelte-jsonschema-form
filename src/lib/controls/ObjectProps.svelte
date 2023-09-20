<script lang="ts">
  import type { JSONSchema7Definition } from "json-schema";
  import Control from "../Control.svelte";
  import AnyOfControl from "./AnyOfControl.svelte";

  export let data: { [prop: string]: any } | undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;
</script>

{#if (properties != null) && (data != null)}
  {#each Object.entries(properties) as [name, props] (name)}
    {@const schema = {title: name, ...props, isRequired: required.includes(name)}}
    <Control {schema} bind:data={data[name]} />
  {/each}
{/if}
{#if (anyOf != null)}
  <AnyOfControl {anyOf} type={'object'} bind:data />
{/if}
