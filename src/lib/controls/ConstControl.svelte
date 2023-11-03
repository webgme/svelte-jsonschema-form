<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";
  import HelperText from "@smui/textfield/helper-text";
  import { getLabel } from "$lib/utilities";

  export let data: any;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let isRequired: boolean | undefined = undefined;
  export let force: boolean = false;

  let checked: boolean = (data != null);

  $: value = $$restProps.const
  $: updateData(checked, value);
  $: updateChecked(data);

  function updateData(checked: boolean, value: any) {
    const setData = (isRequired || force || checked) ? value: undefined;
    if (data !== setData) {
      data = setData;
    }
  }

  function updateChecked(data: any) {
    const setChecked = (data != null) || (isRequired === true);
    if (checked !== setChecked) {
      checked = setChecked;
    }
  }

</script>

{#if !force}
  <div class="jsonschema-form-control control-const">
    <FormField>
      <Checkbox bind:checked disabled={isRequired} />
      <span slot="label">{ getLabel({ title, ...$$restProps }, "") }</span>
    </FormField>
    {#if description}
      <HelperText persistent>{description}</HelperText>
    {/if}
  </div>
{/if}


<style>
  .control-const > :global(.mdc-text-field-helper-text) {
    margin-top: -10px;
    margin-left: 10px;
  }
</style>
