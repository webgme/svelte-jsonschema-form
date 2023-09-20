<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";

  export let data: number | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let format: string | undefined = undefined;
  export let isRequired: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;
  export let multipleOf: number | undefined = undefined;
  export let force: boolean = false;

  let defaultValue = $$props.default ?? NaN;
  let value = data ?? defaultValue;
  let enumValues: number[] | undefined = undefined;

  $: updateData(value);
  $: updateValue(data);
  $: enumValues = $$props.enum;

  function updateData(val: number) {
    if ((data !== val) && (force || ((data != null) || (val != defaultValue)))) {
      const hasVal = (val != null) && !Number.isNaN(val);
      data = hasVal ? val : (force ? defaultValue : undefined);
    }
  }

  function updateValue(val: number | undefined) {
    if (value !== val) {
      value = val ?? defaultValue;
    }
  }
</script>

<div class="jsonschema-form-control control-integer">
  {#if enumValues?.length}
    <Select variant="outlined" bind:value label={title} required={isRequired} menu$portal>
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
      type={format ?? "number"}
      variant="outlined"
      label={title}
      bind:value={value}
      input$min={minimum}
      input$max={maximum}
      input$step={multipleOf}
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
  .control-integer > :global(.mdc-text-field),
  .control-integer > :global(.mdc-select) {
    width: 100%;
  }
</style>