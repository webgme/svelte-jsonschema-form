<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

  export let data: number | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;

  let defaultValue = $$props.default ?? "";
  let value = data ?? defaultValue;

  $: if ((data != null) || (value != defaultValue)) {
    data = value;
  }
</script>

<div>
  <Textfield
    type="number"
    step="any"
    label={title}
    bind:value={value}
    input$min={minimum}
    input$max={maximum}
    {required}
  >
    <HelperText persistent slot="helper">
      {#if description}{description}{/if}
    </HelperText>
  </Textfield>
</div>