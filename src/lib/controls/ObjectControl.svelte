<script lang="ts">
  import type { JSONSchema7Definition } from "json-schema";
  import { hasRequired as checkRequired, isBoolean } from "$lib/utilities";
  import UISchema from "$lib/UISchema";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import AnyOfControl from "./AnyOfControl.svelte";
  import ObjectProps from "./ObjectProps.svelte";

  export let data: { [prop: string]: any } | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;
  export let showEmpty = true;

  let open = true;
  let hasProps = false;
  let enabled = true;
  const uischema = UISchema.get();

  $: justAnyOf = (title == null) && (properties == null) && (anyOf != null);
  $: hasProps = !!Object.keys(properties ?? {}).length || !!Object.keys(anyOf ?? {}).length;
  $: hasRequired = checkRequired({ properties, required, anyOf });
  $: updateEnabled(data, hasRequired);
  $: updateData(enabled);
  $: updateOpen(enabled);
  $: updateOpen($uischema.collapse);

  function updateOpen(enabled: boolean): void;
  function updateOpen(collapse: UISchema['collapse']): void;
  function updateOpen(arg: boolean | UISchema['collapse']) {
    open = isBoolean(arg) ? arg : !UISchema.shouldCollapse($$props, arg, open);
  }

  function updateEnabled(data: any, hasRequired: boolean) {
    const shouldEnable = hasRequired || !!data;
    if (shouldEnable != enabled) {
      enabled = shouldEnable;
    }
  }

  function updateData(enabled: boolean) {
    const hasData = (data != null);
    if (hasData != enabled) {
      data = enabled ? {} : undefined;
    }
  }

  function stop(event: Event) {
    event.stopPropagation();
  }
</script>

{#if showEmpty || hasProps}
  {#if justAnyOf}
    <AnyOfControl {anyOf} bind:data />
  {:else}
    <Accordion class="jsonschema-form-control control-object">
      <Panel bind:open variant="unelevated" disabled={!enabled} class={hasRequired ? "has-required" : undefined}>
        <Header>
          {#if !hasRequired}
            <IconButton toggle bind:pressed={enabled} size="button" on:click={stop}>
              <Icon class="material-icons" on>check_box</Icon>
              <Icon class="material-icons">check_box_outline_blank</Icon>
            </IconButton>
          {/if}
          <span class="control-object-title">{title ?? ""}</span>
          <svelte:fragment slot="description">{description ?? ""}</svelte:fragment>
          <IconButton slot="icon" toggle pressed={open} size="button">
            <Icon class="material-icons" on>expand_less</Icon>
            <Icon class="material-icons">expand_more</Icon>
          </IconButton>
        </Header>
        <Content class="jsonschema-form-controls">
          {#if data}
            <ObjectProps {properties} {required} {anyOf} bind:data />
          {:else}
            <ObjectProps {properties} {required} {anyOf} data={{}} />
          {/if}
        </Content>
      </Panel>
    </Accordion>
  {/if}
{/if}
