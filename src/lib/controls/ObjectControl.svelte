<script lang="ts">
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Control from "../Control.svelte";

  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } = {};
  export let required: string[] = [];
</script>

<Paper>
  {#if title != null}
    <Title>{title}</Title>
  {/if}
  {#if description != null}
    <Subtitle>{description}</Subtitle>
  {/if}
  <Content>
    {#each Object.entries(properties) as [name, props]}
      <Control required={required.includes(name)} title={name} {...props} />
    {/each}
  </Content>
</Paper>
