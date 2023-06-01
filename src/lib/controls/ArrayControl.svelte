<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Icon } from "@smui/fab";
  import Control from "../Control.svelte";

  export let title: string | undefined = undefined;
  export let description: string | null = null;
  export let items: JSONSchema7 | JSONSchema7[] | undefined = undefined;

  let itemInstances: JSONSchema7[] = [];

  $: hasItems = itemInstances.length > 0;

  function addItem() {
    itemInstances = [...itemInstances, items as JSONSchema7];
  }

  function removeItem(index: number) {
    itemInstances = itemInstances.filter((_, i) => i !== index);
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
        {#each itemInstances as item, index}
          <li>
            <Control {...item} />
            <Fab mini on:click={() => removeItem(index)}>
              <Icon class="material-icons">delete</Icon>
            </Fab>
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

  .control-array-items > li > :global(*:not(.mdc-fab:last-child)) {
    flex: 1;
  }

  .control-array-items > li > :global(.mdc-fab:last-child) {
    margin-left: 1rem;
  }

  .control-array-items :global(.smui-paper__content) {
    display: flex;
  }

</style>
