<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";

  export let data: number | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let minimum: number | undefined = undefined;
  export let maximum: number | undefined = undefined;
  export let multipleOf: number | undefined = undefined;

  let defaultValue = $$props.default ?? "";
  let value = data ?? defaultValue;
  let enumValues: number[] | undefined = undefined;

  $: updateData(value);
  $: updateValue(data);
  $: enumValues = $$props.enum;

  function updateData(val: number) {
    if ((data !== val) && ((data != null) || (val != defaultValue))) {
      data = val;
    }
  }

  function updateValue(val: number | undefined) {
    if (value !== val) {
      value = val ?? defaultValue;
    }
  }
</script>

<div class="control-integer">
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
      type="number"
      label={title}
      bind:value={value}
      input$min={minimum}
      input$max={maximum}
      input$step={multipleOf}
      {required}
    >
      <HelperText persistent slot="helper">
        {#if description}{description}{/if}
      </HelperText>
    </Textfield>
  {/if}
</div>
