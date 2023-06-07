<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";

  export let data: boolean | undefined = $$props.default ?? false;
  export let title: string | undefined = undefined;

  let defaultValue = $$props.default ?? false;
  let checked: boolean = data ?? defaultValue;

  $: if ((data != null) || (checked != defaultValue)) {
    data = checked;
  }
</script>

<FormField>
  <Checkbox bind:checked />
  <span slot="label">{title}</span>
</FormField>
