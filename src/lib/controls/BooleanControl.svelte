<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";
  import HelperText from "@smui/textfield/helper-text";

  export let data: boolean | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let force: boolean = false;

  let defaultValue = $$props.default ?? false;
  let checked: boolean = data ?? defaultValue;

  $: updateData(checked);
  $: updateChecked(data);

  function updateData(val: boolean) {
    if ((data !== val) && (force || ((data != null) || (val != defaultValue)))) {
      data = val ?? (force ? defaultValue : undefined);
    }
  }

  function updateChecked(val: boolean | undefined) {
    if (checked !== val) {
      checked = val ?? defaultValue;
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
