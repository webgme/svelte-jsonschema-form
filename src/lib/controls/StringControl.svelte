<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";

  export let data: string | undefined = $$props.default;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let format: string | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let maxLength: number | undefined = undefined;
  export let pattern: string | undefined = undefined;
  export let isRequired: boolean | undefined = undefined;
  export let force: boolean = false;

  let value: string = data ?? "";
  let enumValues: string[] | undefined = undefined;

  $: updateData(value);
  $: updateValue(data);
  $: enumValues = $$props.enum;


  function updateData(val: string) {
    const setData = (!!val || force) ? val : undefined;
    if (data !== setData) {
      data = setData;
    }
  }

  function updateValue(val: string | undefined) {
    const setValue = val ?? "";
    if (value !== setValue) {
      value = setValue;
    }
  }
  
</script>

<div class="jsonschema-form-control control-string">
  {#if enumValues?.length}
    <Select  variant="outlined" bind:value label={title} required={isRequired} menu$portal>
      {#if !force}
        <Option value={null}/>
      {/if}
      {#each enumValues as enumValue}
        <Option value={enumValue}>{enumValue}</Option>
      {/each}
    </Select>
    {#if description}
      <HelperText persistent>{description}</HelperText>
    {/if}
  {:else}
    <Textfield
      variant="outlined"
      label={title}
      type={format}
      bind:value
      input$minlength={minLength}
      input$maxlength={maxLength}
      input$pattern={pattern}
      required={isRequired}
    >
      <svelte:fragment slot="helper">
        {#if description}
          <HelperText persistent>{description}</HelperText>
        {/if}
      </svelte:fragment>
    </Textfield>
  {/if}
</div>

<style>
  .control-string > :global(.mdc-text-field),
  .control-string > :global(.mdc-select) {
    width: 100%;
  }
</style>
