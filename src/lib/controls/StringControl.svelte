<script lang="ts">
  import Textfield from "@smui/textfield";

  export let title: string | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let maxLength: number | undefined = undefined;
  export let pattern: string | undefined = undefined;
  export let required: boolean | undefined = undefined;

  let value: string = $$props.default ?? "";
</script>

<Textfield
  label={title}
  bind:value={value}
  input$minlength={minLength}
  input$maxlength={maxLength}
  input$pattern={pattern}
  {required}
/>
