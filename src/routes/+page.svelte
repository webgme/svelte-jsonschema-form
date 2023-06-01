<script lang="ts">
  import SchemaFrom from "$lib/SchemaForm.svelte";
  import type { JSONSchema7 } from "json-schema";
  import testSchema from "../schemas/nested.json";

  const schema = testSchema as JSONSchema7;
</script>

<SchemaFrom schema={schema} />
