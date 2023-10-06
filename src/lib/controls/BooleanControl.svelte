<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";
  import HelperText from "@smui/textfield/helper-text";

  export let data: boolean | undefined = $$props.default;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let force: boolean = false;

  let checked: boolean = data ?? false;

  $: updateData(checked);
  $: updateChecked(data);

  function updateData(val: boolean) {
    const setData = ((data != null) || val || force) ? val : undefined;
    if (data !== setData) {
      data = setData;
    }
  }

  function updateChecked(val: boolean | undefined) {
    const setValue = val ?? $$props.default ?? false;
    if (checked !== setValue) {
      checked = setValue;
    }
  }

</script>

<div class="jsonschema-form-control control-boolean">
  <FormField>
    <Checkbox bind:checked />
    <span slot="label">{title}</span>
  </FormField>
  {#if description}
    <HelperText persistent>{description}</HelperText>
  {/if}
</div>

<style>
  .control-boolean > :global(.mdc-text-field-helper-text) {
    margin-top: -10px;
    margin-left: 10px;
  }
</style>
