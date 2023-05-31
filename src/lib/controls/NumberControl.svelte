<script lang="ts">
  import Textfield from "@smui/textfield";

  export let title: string | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;

  let value = $$props.default ?? "";
</script>

<Textfield
  type="number"
  step="any"
  label={title}
  bind:value={value}
  input$min={minimum}
  input$max={maximum}
  {required}
/>
