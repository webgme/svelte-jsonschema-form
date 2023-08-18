<script lang="ts">
  import type { JSONSchema7Definition } from "json-schema";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import Control from "../Control.svelte";
  import AnyOfControl from "./AnyOfControl.svelte";

  export let data: { [prop: string]: any };
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;

  let open = true;

  $: if (data == null) {
    data = {};
  }

  $: justAnyOf = (title == null) && (properties == null) && (anyOf != null);
</script>

{#if justAnyOf}
  <AnyOfControl {anyOf} type={'object'} bind:data={data} />
{:else}
  <Accordion class="control-object">
    <Panel bind:open color="secondary">
      <Header>
        {title ?? ""}
        <span slot="description">{description ?? ""}</span>
        <IconButton slot="icon" toggle pressed={open}>
          <Icon class="material-icons" on>expand_less</Icon>
          <Icon class="material-icons">expand_more</Icon>
        </IconButton>
      </Header>
      <Content color="white">
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
    </Panel>
  </Accordion>
{/if}


<style>
  :global(.control-object) {
    flex-basis: 100%;
  }
  :global(.control-object.smui-accordion > .smui-accordion__panel > .smui-paper__content) {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  :global(.control-object.smui-accordion > .smui-accordion__panel > .smui-paper__content > *) {
    flex: 1;
    min-width: 200px;
  }

  :global(.control-object.smui-accordion > .smui-accordion__panel > .smui-paper__content > .control-object),
  :global(.control-object.smui-accordion > .smui-accordion__panel > .smui-paper__content > .control-array) {
    flex-basis: 100%;
  }
</style>
