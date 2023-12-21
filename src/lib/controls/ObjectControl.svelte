<script lang="ts">
  import type { JSONSchema7Definition } from "json-schema";
  import { isBoolean } from "$lib/utilities";
  import UISchema from "$lib/UISchema";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import ObjectProps from "./ObjectProps.svelte";

  export let data: { [prop: string]: any } | undefined = undefined;
  export let uischema: UISchema = {};
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;
  export let isRequired: boolean | undefined = undefined;

  let open = true;
  let hasProps = false;
  let enabled = true;

  $: uiOptions = UISchema.Options.get(uischema);
  $: hasProps = !!Object.keys(properties ?? {}).length || !!Object.keys(anyOf ?? {}).length;
  $: ignoreEmpty = $uiOptions.ignoreEmpty ?? false;
  $: updateEnabled(data, isRequired, ignoreEmpty);
  $: updateData(enabled);
  $: updateOpen(enabled);
  $: updateOpen($uiOptions.collapse);

  function updateOpen(enabled: boolean): void;
  function updateOpen(collapse: UISchema.Options.Collapse): void;
  function updateOpen(arg: boolean | UISchema.Options.Collapse) {
    open = hasProps && (isBoolean(arg) ? arg : !UISchema.shouldCollapse($$props, arg, open));
  }

  function updateEnabled(data: any, isRequired: boolean | undefined, ignoreEmpty: boolean) {
    const shouldEnable = isRequired || ignoreEmpty || !!data;
    if (shouldEnable != enabled) {
      enabled = shouldEnable;
    }
  }

  function updateData(enabled: boolean) {
    const hasData = (data != null);
    const shouldHaveData = enabled && !ignoreEmpty;
    if (hasData != shouldHaveData) {
      data = shouldHaveData ? {} : undefined;
    }
  }

  function stop(event: Event) {
    event.stopPropagation();
  }
</script>

<Accordion class="jsonschema-form-control control-object">
  <Panel
    bind:open
    variant="unelevated"
    disabled={!enabled}
    class={(isRequired || ignoreEmpty) ? "no-disable" : undefined}
    nonInteractive={!hasProps}
  >
    <Header>
      {#if !isRequired && !ignoreEmpty}
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
      <ObjectProps {title} {properties} {required} {anyOf} bind:data {uischema} />
    </Content>
  </Panel>
</Accordion>
