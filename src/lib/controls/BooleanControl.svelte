<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";

  export let data: boolean | undefined = undefined;
  export let title: string | undefined = undefined;

  let defaultValue = $$props.default ?? false;
  let checked: boolean = data ?? defaultValue;

  $: updateData(checked);
  $: updateChecked(data);

  function updateData(val: boolean) {
    if ((data !== val) && ((data != null) || (val != defaultValue))) {
      data = val;
    }
  }

  function updateChecked(val: boolean | undefined) {
    if (checked !== val) {
      checked = val ?? defaultValue;
    }
  }

</script>

<FormField class="jsonschema-form-control control-boolean">
  <Checkbox bind:checked />
  <span slot="label">{title}</span>
</FormField>
