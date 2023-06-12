<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Icon } from "@smui/fab";
  import IconButton from "@smui/icon-button";
  import Control from "../Control.svelte";

  export let data: any[] = [];
  export let title: string | undefined = undefined;
  export let description: string | null = null;
  export let items: JSONSchema7 | JSONSchema7[] | undefined = undefined;

  function getKey(index: number) {
    const value = data[index];
    const useIndex = (items == null) || (typeof items !== "object");
    return useIndex ? index : value;
  }

  $: hasItems = data.length > 0;

  function addItem() {
    data = [...data, undefined];
  }

  function removeItem(index: number) {
    data = (data.splice(index, 1), data);
  }

  function moveItemUp(index: number) {
    if (index > 0) {
      [data[index - 1], data[index]] = [data[index], data[index - 1]];
    }
  }

  function moveItemDown(index: number) {
    if (index < data.length - 1) {
      [data[index + 1], data[index]] = [data[index], data[index + 1]];
    }
  }
</script>

<Paper class="control-array">
  <Title>
    <span>
      {#if title != null}{title}{/if}
    </span>
    {#if items != null}
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
            <Control {...items} bind:data={value} />
            <div class="control-array-item-actions">
              <IconButton
                on:click={() => moveItemUp(index)}
                class="material-icons"
                size="button"
                disabled={index === 0}
              >keyboard_arrow_up</IconButton>
              <Fab mini on:click={() => removeItem(index)}>
                <Icon class="material-icons">delete</Icon>
              </Fab>
              <IconButton
                on:click={() => moveItemDown(index)}
                class="material-icons"
                size="button"
                disabled={index === data.length - 1}
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
