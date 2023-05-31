<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";

  export let title: string | undefined = undefined;

  let checked: boolean = $$props.default ?? false;
</script>

<FormField>
  <Checkbox bind:checked />
  <span slot="label">{title}</span>
</FormField>
