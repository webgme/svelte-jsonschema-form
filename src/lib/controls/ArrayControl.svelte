<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import Fab, { Icon } from "@smui/fab";
  import IconButton from "@smui/icon-button";
  import Control from "../Control.svelte";

  export let data: any[];
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

  $: if (data == null) {
    data = [];
  }
  $: hasItems = data?.length > 0;
  $: {
    const itemsIsArray = Array.isArray(items);
    [prefixed, additional] = [
      (itemsIsArray ? items : prefixItems ?? []) as JSONSchema7[],
      (itemsIsArray ? additionalItems : items) as JSONSchema7
    ];
  }
  $: canAddItem = (additional != null) && (data.length < maxItems);

  function getKey(index: number) {
    const value = data[index];
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
    return (index >= prefixed.length) && (data.length > minItems);
  }

  function canMoveItemUp(index: number) {
    return (index > 0) && (getType(index) === getType(index - 1));
  }

  function canMoveItemDown(index: number) {
    return (index < data.length - 1) && (getType(index) === getType(index + 1));
  }

  function addItem() {
    if (canAddItem) {
      data = [...data, undefined];
    }
  }

  function removeItem(index: number) {
    if (canRemoveItem(index)) {
      data = (data.splice(index, 1), data);
    }
  }

  function moveItemUp(index: number) {
    if (canMoveItemUp(index)) {
      [data[index - 1], data[index]] = [data[index], data[index - 1]];
    }
  }

  function moveItemDown(index: number) {
    if (canMoveItemDown(index)) {
      [data[index + 1], data[index]] = [data[index], data[index + 1]];
    }
  }

  function headerAddItem(event: Event) {
    addItem();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
</script>

<Accordion class="jsonschema-form-control control-array">
  <Panel bind:open variant="unelevated">
    <Header>
      {title ?? ""}
      <span slot="description">{description ?? ""}</span>
      <div slot="icon">
        {#if canAddItem}
          <IconButton class="material-icons" on:click={headerAddItem}>add</IconButton>
        {/if}
        <IconButton toggle pressed={open}>
          <Icon class="material-icons" on>expand_less</Icon>
          <Icon class="material-icons">expand_more</Icon>
        </IconButton>
      </div>
    </Header>
    <Content>
      <ul class="control-array-items">
        {#each data as value, index (getKey(index))}
          <li>
            <div class="jsonschema-form-controls">
              <Control {...getItem(index)} bind:data={value} force={true} />
            </div>
            <div class="control-array-item-actions">
              <IconButton
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
                on:click={() => removeItem(index)}
                class="material-icons"
                size="button"
                disabled={!canRemoveItem(index)}
              >delete</IconButton>
              <IconButton
                on:click={() => moveItemDown(index)}
                class="material-icons"
                size="button"
                disabled={!canMoveItemDown(index)}
              >keyboard_arrow_down</IconButton>
            </div>
          </li>
        {/each}
      </ul>
    </Content>
  </Panel>
</Accordion>

<style>
  .control-array-items {
    list-style: none;
    padding-left: 0;
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

  .control-array-items :global(.smui-paper__content) {
    display: flex;
  }

</style>
