<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let maxLength: number | undefined = undefined;
  export let pattern: string | undefined = undefined;
  export let required: boolean | undefined = undefined;

  let value: string = $$props.default ?? "";
</script>

<div>
  <Textfield
    label={title}
    bind:value={value}
    input$minlength={minLength}
    input$maxlength={maxLength}
    input$pattern={pattern}
    {required}
  >
    <HelperText persistent slot="helper">
      {#if description}{description}{/if}
    </HelperText>
  </Textfield>
</div>
