<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import UISchema from "$lib/UISchema";
  import { hasRequired as checkRequired, isBoolean } from "$lib/utilities";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from "@smui/icon-button";
  import Control from "../Control.svelte";

  export let data: any[] | undefined = undefined;
  export let uischema: UISchema = {};
  export let title: string | undefined = undefined;
  export let description: string | null = null;

  export let prefixItems: JSONSchema7[] | undefined = undefined;
  export let items: JSONSchema7 | JSONSchema7[] | undefined = undefined;
  export let additionalItems: JSONSchema7 | undefined = undefined;

  // Validation Settings
  export let minItems: number = 0;
  export let maxItems: number = Infinity;
  // TODO: implement additional validation settings
  // export let uniqueItems: boolean = false;
  // export let contains: JSONSchema7 | undefined = undefined;
  // export let minContains: number = 0;
  // export let maxContains: number = Infinity;
  // export let unevaluatedItems: JSONSchema7 | undefined = undefined; 

  let open = true;
  let hasItems: boolean = false;
  let prefixed: JSONSchema7[] = [];
  let additional: JSONSchema7 | undefined = undefined;
  let canAddItem = false;
  let enabled = true;

  $: uiOptions = UISchema.Options.get(uischema);
  $: ignoreEmpty = $uiOptions.ignoreEmpty ?? false;
  $: hasItems = (data?.length ?? 0) > 0;
  $: {
    const itemsIsArray = Array.isArray(items);
    [prefixed, additional] = [
      (itemsIsArray ? items : prefixItems ?? []) as JSONSchema7[],
      (itemsIsArray ? additionalItems : items) as JSONSchema7
    ];
  }
  $: canAddItem = (additional != null) && (ignoreEmpty || !!data) && ((data?.length ?? 0) < maxItems);
  $: hasRequired = checkRequired({ prefixItems, items, additionalItems } as any);
  $: updateEnabled(data, hasRequired);
  $: updateData(enabled, ignoreEmpty);
  $: updateOpen(enabled);
  $: updateOpen($uiOptions.collapse);

  function getKey(index: number) {
    const value = data![index];
    const useIndex = (value == null) || (typeof value !== "object");
    return useIndex ? `${index} | ${getType(index) ?? ""}` : value;
  }

  function getItem(index: number) {
    return (prefixed.length > index) ? prefixed[index] : additional;
  }

  function getType(index: number) {
    return getItem(index)?.type;
  }

  function canRemoveItem(index: number) {
    return (index >= prefixed.length) && ((data?.length ?? 0) > minItems);
  }

  function canMoveItemUp(index: number) {
    return (index > 0) && (getType(index) === getType(index - 1));
  }

  function canMoveItemDown(index: number) {
    return (index < (data?.length ?? 0) - 1) && (getType(index) === getType(index + 1));
  }

  function addItem() {
    if (canAddItem) {
      data = [...(data ?? []), undefined];
    }
  }

  function removeItem(index: number) {
    if (canRemoveItem(index)) {
      data?.splice(index, 1);
      data = (ignoreEmpty && (data?.length ?? 0) === 0) ? undefined : data;
    }
  }

  function moveItemUp(index: number) {
    if (canMoveItemUp(index)) {
      [data![index - 1], data![index]] = [data![index], data![index - 1]];
    }
  }

  function moveItemDown(index: number) {
    if (canMoveItemDown(index)) {
      [data![index + 1], data![index]] = [data![index], data![index + 1]];
    }
  }

  function headerAddItem(event: Event) {
    addItem();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  function updateOpen(enabled: boolean): void;
  function updateOpen(collapse: UISchema.Options.Collapse): void;
  function updateOpen(arg: boolean | UISchema.Options.Collapse) {
    open = hasItems || (isBoolean(arg) ? arg : !UISchema.shouldCollapse($$props, arg, open));
  }

  function updateEnabled(data: any, hasRequired: boolean) {
    const shouldEnable = hasRequired || !!data;
    if (shouldEnable != enabled) {
      enabled = shouldEnable;
    }
  }

  function updateData(enabled: boolean, ignoreEmpty: boolean) {
    const hasData = (data != null);
    const shouldHaveData = enabled && !ignoreEmpty;
    if (hasData != shouldHaveData) {
      data = shouldHaveData ? [] : undefined;
    }
  }

  function stop(event: Event) {
    event.stopPropagation();
  }
</script>

<Accordion class="jsonschema-form-control control-array">
  <Panel bind:open variant="unelevated"  disabled={!enabled}  class={hasRequired ? "has-required" : undefined}>
    <Header>
      {#if !hasRequired}
        <IconButton type="button" toggle bind:pressed={enabled} size="button" on:click={stop}>
          <Icon class="material-icons" on>check_box</Icon>
          <Icon class="material-icons">check_box_outline_blank</Icon>
        </IconButton>
      {/if}
      <span class="control-array-title">{title ?? ""}</span>
      <svelte:fragment slot="description">{description ?? ""}</svelte:fragment>
      <div slot="icon">
        {#if canAddItem}
          <IconButton type="button" class="material-icons" on:click={headerAddItem} size="button">add</IconButton>
        {/if}
        <IconButton type="button" toggle pressed={open} size="button">
          <Icon class="material-icons" on>expand_less</Icon>
          <Icon class="material-icons">expand_more</Icon>
        </IconButton>
      </div>
    </Header>
    <div class="smui-paper__content">
      <ul class="control-array-items">
        {#if data}
          {#each data as value, index (getKey(index))}
            <li>
              <div class="jsonschema-form-controls">
                <Control
                  schema={getItem(index)}
                  bind:data={value}
                  uischema={uischema?.["items"]}
                  force
                />
              </div>
              <div class="control-array-item-actions">
                <IconButton
                  type="button"
                  on:click={() => moveItemUp(index)}
                  class="material-icons"
                  size="button"
                  disabled={!canMoveItemUp(index)}
                >keyboard_arrow_up</IconButton>
                <!-- {#if canRemoveItem(index)}
                  <Fab mini on:click={() => removeItem(index)}>
                    <Icon class="material-icons">delete</Icon>
                  </Fab>
                {/if} -->
                <IconButton
                  type="button"
                  on:click={() => removeItem(index)}
                  class="material-icons"
                  size="button"
                  disabled={!canRemoveItem(index)}
                >delete</IconButton>
                <IconButton
                  type="button"
                  on:click={() => moveItemDown(index)}
                  class="material-icons"
                  size="button"
                  disabled={!canMoveItemDown(index)}
                >keyboard_arrow_down</IconButton>
              </div>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  </Panel>
</Accordion>

<style>
  .control-array-items {
    list-style: none;
    padding-left: 0;
    margin: 0;
    width: 100%;
  }

  .control-array-items > li {
    display: flex;
    align-items: center;
  }

  .control-array-items > li > :global(*:not(.control-array-item-actions)) {
    flex: 1;
  }

  .control-array-items > li > .control-array-item-actions {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
  }

  .control-array-items > li > .control-array-item-actions :global(.mdc-icon-button) {
    color: revert;
  }
</style>
