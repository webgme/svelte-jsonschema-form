<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";

  export let data: number | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let isRequired: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;
  export let multipleOf: number | undefined = undefined;
  export let force: boolean = false;

  let defaultValue = $$props.default ?? "";
  let value = data ?? defaultValue;
  let enumValues: number[] | undefined = undefined;

  $: updateData(value);
  $: updateValue(data);
  $: enumValues = $$props.enum;

  function updateData(val: number) {
    if ((data !== val) && ((data != null) || (val != defaultValue))) {
      data = val ?? undefined;
    }
  }

  function updateValue(val: number | undefined) {
    if (value !== val) {
      value = val ?? defaultValue;
    }
  }
</script>

<div class="control-number">
  {#if enumValues?.length}
    <Select variant="outlined" bind:value label={title} required={isRequired}>
      {#if !force}
        <Option value={null}/>
      {/if}
      {#each enumValues as enumValue}
        <Option value={enumValue}>{enumValue}</Option>
      {/each}
    </Select>
    <HelperText persistent>
      {#if description}{description}{/if}
    </HelperText>
  {:else}
    <Textfield
      type="number"
      variant="outlined"
      label={title}
      bind:value={value}
      input$min={minimum}
      input$max={maximum}
      input$step={multipleOf ?? "any"}
      required={isRequired}
    >
      <HelperText persistent slot="helper">
        {#if description}{description}{/if}
      </HelperText>
    </Textfield>
  {/if}
</div>

<style>
  .control-number > :global(.mdc-text-field),
  .control-number > :global(.mdc-select) {
    width: 100%;
  }
</style>
