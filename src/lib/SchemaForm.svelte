<script lang="ts">
  import 'core-js/actual/structured-clone';
  import type { JSONSchema7 } from "json-schema";
  import JsonSchemaDereferencer from "@json-schema-tools/dereferencer";
  import Ajv from "ajv";
  import mergeAllOf from "json-schema-merge-allof";
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import ObjectProps from "./controls/ObjectProps.svelte";
  import Control from "./Control.svelte";
  import ValidationError from "./ValidationError";
  import { isObjectSchema } from './utilities';

  export let schema: JSONSchema7 = {};
  export let data: { [prop: string]: any } = {};

  /* A bit of a hack - When bulding the static test site, the dereferencer is still behind a
   * `.default` property for some reason. I'm guessing it has something to do with how modules are
   * imported during the svelte build process. When running in browser, it appears to be imported
   * properly (so `.default` is `undefined`).
   */
  const Dereferencer: typeof JsonSchemaDereferencer = (<any>JsonSchemaDereferencer).default ?? JsonSchemaDereferencer;
  const ajv = new Ajv();

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

  $: validator = ajv.compile(schema);

  export function validate() {
    const valid = validator(data);
    return valid || (validator.errors ?? false);
  }

  export function getBlob() {
    return new Blob(
      [JSON.stringify(data)],
      { type: "application/json"}
    );
  }

  export function getUrl() {
    const blob = getBlob();
    return URL.createObjectURL(blob);
  }

  export function download(filename: string = "data", options?: { validate: boolean }) {
    const opts = Object.assign({ validate: true }, options);
    const validity = !opts.validate || validate();
    if (validity !== true) {
      throw new ValidationError(validity)
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
    {#if isObjectSchema(dereferenced)}
      <Paper>
        {#if dereferenced.title}
          <Title>{dereferenced.title}</Title>
        {/if}
        {#if dereferenced.description}
          <Subtitle>{dereferenced.description}</Subtitle>
        {/if}
        <Content class="jsonschema-form-controls">
          <ObjectProps {...dereferenced} bind:data />
        </Content>
      </Paper>
    {:else}
      <Control {...dereferenced} bind:data />
    {/if}
  {:catch error}
    <div class="error">ERROR: {error.message}</div>
  {/await}

  {#if $$slots.default}
    <div class="actions">
      <slot {actions} />
    </div>
  {/if}
</form>

<style>
  .jsonschema-form .actions {
    margin: 12px 0;
  }

  .jsonschema-form :global(.jsonschema-form-controls) {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .jsonschema-form :global(.jsonschema-form-controls > .jsonschema-form-control) {
    flex-basis: 325px;
  }

  .jsonschema-form :global(.jsonschema-form-controls > .control-array),
  .jsonschema-form :global(.jsonschema-form-controls > .control-object) {
    flex-basis: 100%;
  }
</style>
 