<script lang="ts">
  import 'core-js/actual/structured-clone';
  import type { JSONSchema7 } from "json-schema";
  import JsonSchemaDereferencer from "@json-schema-tools/dereferencer";
  import validator, { ValidationErrors } from "@json-schema-tools/validator";
  import mergeAllOf from "json-schema-merge-allof";
  import Control from "./Control.svelte"; 

  export let schema: JSONSchema7 = {};
  export let data: { [prop: string]: any } = {};

  /* A bit of a hack - When bulding the static test site, the dereferencer is still behind a
   * `.default` property for some reason. I'm guessing it has something to do with how modules are
   * imported during the svelte build process. When running in browser, it appears to be imported
   * properly (so `.default` is `undefined`).
   */
  const Dereferencer: typeof JsonSchemaDereferencer = (<any>JsonSchemaDereferencer).default ?? JsonSchemaDereferencer;

  const actions = {
    get blob() {
      return getBlob();
    },

    get url() {
      return getUrl();
    },

    validate,
    download
  };

  $: dereferencing = new Dereferencer(
    mergeAllOf(structuredClone(schema)),
    { mutate: true }
  ).resolve();

  async function validate() {
    const schema = await dereferencing;
    return validator(schema, data);
  }

  function getBlob() {
    return new Blob(
      [JSON.stringify(data)],
      { type: "application/json"}
    );
  }

  function getUrl() {
    const blob = getBlob();
    return URL.createObjectURL(blob);
  }

  async function download(filename: string = "data", options?: { validate: boolean }) {
    const opts = Object.assign({ validate: true }, options);
    const validity = opts.validate && await validate();
    if (validity instanceof ValidationErrors) {
      throw validity;
    }
    const url = getUrl();
    const anchor = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
    anchor.href = url;
    anchor.setAttribute("download", `${filename}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
</script>

<form class="jsonschema-form">
  {#await dereferencing}
    <p>dereferencing...</p>
  {:then dereferenced}
    <Control {...dereferenced} bind:data={data} />
  {:catch error}
    <div class="error">ERROR: {error.message}</div>
  {/await}

  <div class="actions">
    <slot {actions} />
  </div>
</form>
 