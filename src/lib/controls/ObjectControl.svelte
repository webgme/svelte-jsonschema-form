<script lang="ts">
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Control from "../Control.svelte";

  export let title: string | null = null;
  export let description: string | null = null;
  export let properties: { [prop: string]: any } = {};
  export let required: string[] = [];
</script>

<div>
  <Paper>
    {#if title !== null}
      <Title>{title}</Title>
    {/if}
    {#if description !== null}
      <Subtitle>{description}</Subtitle>
    {/if}
    <Content>
      {#each Object.entries(properties) as [name, props]}
        <Control {...props} required={required.includes(name)} />
      {/each}
    </Content>
  </Paper>
</div>
