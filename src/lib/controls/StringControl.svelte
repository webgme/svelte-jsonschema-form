<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";

  export let data: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let maxLength: number | undefined = undefined;
  export let pattern: string | undefined = undefined;
  export let required: boolean | undefined = undefined;

  let defaultValue = $$props.default ?? "";
  let value: string = data ?? defaultValue;
  let enumValues: string[] | undefined = undefined;

  $: updateData(value);
  $: updateValue(data);
  $: enumValues = $$props.enum;


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
  {#if enumValues?.length}
    <Select bind:value label={title} {required}>
      {#each enumValues as enumValue}
        <Option value={enumValue}>{enumValue}</Option>
      {/each}
    </Select>
    <HelperText persistent>
      {#if description}{description}{/if}
    </HelperText>
  {:else}
    <Textfield
      label={title}
      bind:value
      input$minlength={minLength}
      input$maxlength={maxLength}
      input$pattern={pattern}
      {required}
    >
      <HelperText persistent slot="helper">
        {#if description}{description}{/if}
      </HelperText>
    </Textfield>
  {/if}
</div>
