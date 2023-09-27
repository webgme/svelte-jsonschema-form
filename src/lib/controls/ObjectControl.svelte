<script lang="ts">
  import type { JSONSchema7Definition } from "json-schema";
  import { hasRequired as checkRequired, isBoolean } from "$lib/utilities";
  import UISchema from "$lib/UISchema";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import AnyOfControl from "./AnyOfControl.svelte";
  import ObjectProps from "./ObjectProps.svelte";

  export let data: { [prop: string]: any } | undefined = undefined;
  export let uischema: UISchema = {};
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;

  let open = true;
  let hasProps = false;
  let enabled = true;

  $: uiOptions = UISchema.Options.get(uischema);
  $: justAnyOf = (title == null) && (properties == null) && (anyOf != null);
  $: hasProps = !!Object.keys(properties ?? {}).length || !!Object.keys(anyOf ?? {}).length;
  $: hasRequired = checkRequired({ properties, required, anyOf });
  $: ignoreEmpty = $uiOptions.ignoreEmpty ?? false;
  $: updateEnabled(data, hasRequired, ignoreEmpty);
  $: updateData(enabled);
  $: updateOpen(enabled);
  $: updateOpen($uiOptions.collapse);

  function updateOpen(enabled: boolean): void;
  function updateOpen(collapse: UISchema.Options.Collapse): void;
  function updateOpen(arg: boolean | UISchema.Options.Collapse) {
    open = hasProps && (isBoolean(arg) ? arg : !UISchema.shouldCollapse($$props, arg, open));
  }

  function updateEnabled(data: any, hasRequired: boolean, ignoreEmpty: boolean) {
    const shouldEnable = hasRequired || ignoreEmpty || !!data;
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

{#if justAnyOf}
  <AnyOfControl {anyOf} type={'object'} bind:data {uischema} />
{:else}
  <Accordion class="jsonschema-form-control control-object">
    <Panel
      bind:open
      variant="unelevated"
      disabled={!enabled}
      class={(hasRequired || ignoreEmpty) ? "no-disable" : undefined}
      nonInteractive={!hasProps}
    >
      <Header>
        {#if !hasRequired && !ignoreEmpty}
          <IconButton type="button" toggle bind:pressed={enabled} size="button" on:click={stop}>
            <Icon class="material-icons" on>check_box</Icon>
            <Icon class="material-icons">check_box_outline_blank</Icon>
          </IconButton>
        {/if}
        <span class="control-object-title">{title ?? ""}</span>
        <svelte:fragment slot="description">{description ?? ""}</svelte:fragment>
        <svelte:fragment slot="icon">
          {#if hasProps}
            <IconButton type="button" toggle pressed={open} size="button">
              <Icon class="material-icons" on>expand_less</Icon>
              <Icon class="material-icons">expand_more</Icon>
            </IconButton>
          {/if}
        </svelte:fragment>
      </Header>
      <Content class="jsonschema-form-controls">
        <ObjectProps {properties} {required} {anyOf} bind:data {uischema} />
      </Content>
    </Panel>
  </Accordion>
{/if}
