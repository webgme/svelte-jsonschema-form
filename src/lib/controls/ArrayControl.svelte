<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Icon } from "@smui/fab";
  import IconButton from "@smui/icon-button";
  import Control from "../Control.svelte";

  export let data: any[] = [];
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

  let hasItems: boolean = false;
  let prefixed: JSONSchema7[] = [];
  let additional: JSONSchema7 | undefined = undefined;
  let canAddItem = false;

  $: hasItems = data.length > 0;
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
    const key = useIndex ? `${index} | ${getType(index) ?? ""}` : value;
    console.log("key:", key);
    return key;
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
</script>

<Paper class="control-array">
  <Title>
    <span>
      {#if title != null}{title}{/if}
    </span>
    {#if canAddItem}
      <Fab mini on:click={addItem}>
        <Icon class="material-icons">add</Icon>
      </Fab>
    {/if}
  </Title>
  {#if description != null}
    <Subtitle>{description}</Subtitle>
  {/if}
  {#if hasItems}
    <Content>
      <ul class="control-array-items">
        {#each data as value, index (getKey(index))}
          <li>
            <Control {...getItem(index)} bind:data={value} />
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
  {/if}
</Paper>

<style>
  :global(.control-array .smui-paper__title) {
    display: flex;
    justify-content: space-between;
  }

  .control-array-items {
    list-style: none;
    padding-left: 0;
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

  .control-array-items :global(.smui-paper__content) {
    display: flex;
  }

</style>
