<script lang="ts">
  import type { JSONSchema7 } from "json-schema";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";

  export let schema: JSONSchema7;
  // export let data: { [prop: string]: any } = {};

  $: title = schema.title;
  $: description = schema.description;
</script>

<div>
  <Paper>
    <Title>{title}</Title>
    <Subtitle>{description}</Subtitle>
    <Content><pre>{JSON.stringify(schema, null, 2)}</pre></Content>
  </Paper>
</div>