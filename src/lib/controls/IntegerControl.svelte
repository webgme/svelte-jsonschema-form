<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;

  let value = $$props.default ?? "";
</script>

<Textfield
  type="number"
  label={title}
  bind:value={value}
  input$min={minimum}
  input$max={maximum}
  {required}
>
  {#if description}
    <HelperText persistent slot="helper">{description}</HelperText>
  {/if}
</Textfield>
