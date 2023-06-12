<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

  export let data: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let maxLength: number | undefined = undefined;
  export let pattern: string | undefined = undefined;
  export let required: boolean | undefined = undefined;

  let defaultValue = $$props.default ?? "";
  let value: string = data ?? defaultValue;

  $: updateData(value);
  $: updateValue(data);


  function updateData(val: string) {
    if ((data !== val) && ((data != null) || (val != defaultValue))) {
      data = val;
    }
  }

  function updateValue(val: string | undefined) {
    if (value !== val) {
      value = val ?? defaultValue;
    }
  }
  
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
