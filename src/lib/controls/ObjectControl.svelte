<script lang="ts">
  import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Control from "../Control.svelte";
  import AnyOfControl from "./AnyOfControl.svelte";

  export let data: { [prop: string]: any };
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;

  $: if (data == null) {
    data = {};
  }

  $: justAnyOf = (title == null) && (properties == null) && (anyOf != null);
</script>

{#if justAnyOf}
  <AnyOfControl {anyOf} type={'object'} bind:data={data} />
{:else}
  <Paper>
    {#if $$slots.title}
      <Title>
        <slot name="title" {title}>{title}</slot>
      </Title>
    {:else if title != null}
      <Title>{title}</Title>
    {/if}
    {#if description != null}
      <Subtitle>{description}</Subtitle>
    {/if}
    <Content>
      {#if properties != null}
        {#each Object.entries(properties) as [name, props] (name)}
          <Control
            isRequired={required.includes(name)}
            title={name}
            {...props}
            bind:data={data[name]}
          />
        {/each}
      {/if}
      {#if anyOf != null}
        <AnyOfControl {anyOf} type={'object'} bind:data={data} />
      {/if}
    </Content>
  </Paper>
{/if}
