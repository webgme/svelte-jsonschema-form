<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";

  export let data: number | undefined = $$props.default;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let format: string | undefined = undefined;
  export let isRequired: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;
  export let multipleOf: number | undefined = undefined;
  export let force: boolean = false;

  let value = data ?? NaN;
  let enumValues: number[] | undefined = undefined;

  $: updateData(value);
  $: updateValue(data);
  $: enumValues = $$props.enum;

  function updateData(val: number) {
    const setData = Number.isNaN(val) ? force ? ($$props.default ?? NaN) : undefined : val;
    if (data !== setData) {
      data = setData;
    }
  }

  function updateValue(val: number | undefined) {
    const setValue = val ?? NaN;
    if (value !== setValue) {
      value = setValue;
    }
  }
</script>

<div class="jsonschema-form-control control-number">
  {#if enumValues?.length}
    <Select variant="outlined" bind:value label={title} required={isRequired} menu$portal>
      {#if !force}
        <Option value={NaN}/>
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
      input$step={multipleOf ?? "any"}
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
  .control-number > :global(.mdc-text-field),
  .control-number > :global(.mdc-select) {
    width: 100%;
  }
</style>
