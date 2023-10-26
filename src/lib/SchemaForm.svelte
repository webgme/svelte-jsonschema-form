<script lang="ts">
  import 'core-js/actual/structured-clone';
  import type { JSONSchema7Definition } from "json-schema";
  import DownloadOptions, { type DataTransform } from './DowloadOptions';
  import UISchema from "./UISchema";
  import JsonSchemaDereferencer from "@json-schema-tools/dereferencer";
  import Ajv from "ajv";
  import ajvFormats from "ajv-formats";
  import mergeAllOf from "json-schema-merge-allof";
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import ObjectProps from "./controls/ObjectProps.svelte";
  import Control from "./Control.svelte";
  import ValidationError from "./ValidationError";
  import { isObjectSchema, isString, isBoolean } from './utilities';
  import libVersion from "./version";

  export let schema: JSONSchema7Definition = {};
  export let data: { [prop: string]: any } = {};
  export let uischema: UISchema = {};

  /* A bit of a hack - When bulding the static test site, the dereferencer is still behind a
   * `.default` property for some reason. I'm guessing it has something to do with how modules are
   * imported during the svelte build process. When running in browser, it appears to be imported
   * properly (so `.default` is `undefined`).
   */
  const Dereferencer: typeof JsonSchemaDereferencer = (<any>JsonSchemaDereferencer).default ?? JsonSchemaDereferencer;
  const ajv = new Ajv();
  ajvFormats(ajv);
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
  let uischemaStore = UISchema.store(uischema);

  $: dereferencing = new Dereferencer(
    isBoolean(schema) ? schema : mergeAllOf(structuredClone(schema)),
    { mutate: true }
  ).resolve();

  $: validator = ajv.compile(schema);

  $: updateUischemaStore(uischema);

  function updateUischemaStore(uischema: UISchema) {
    $uischemaStore = uischema[UISchema.Options.Key] ?? {};
  }

  export function validate() {
    const valid = validator(data);
    return valid || (validator.errors ?? false);
  }

  export function getBlob(transform?: DataTransform) {
    const transformed = transform ? transform(structuredClone(data), schema) : data;
    return new Blob(
      [JSON.stringify(transformed)],
      { type: "application/json"}
    );
  }

  export function getUrl(transform?: DataTransform) {
    const blob = getBlob(transform);
    return URL.createObjectURL(blob);
  }

  export function download(options?: DownloadOptions): void;
  export function download(filename: string, options?: DownloadOptions): void;
  export function download(arg1?: string | DownloadOptions, arg2?: DownloadOptions) {
    const [filename, options] = isString(arg1)
      ? [arg1, DownloadOptions.withDefaults(arg2)]
      : ["data", DownloadOptions.withDefaults(arg1)];
    const validity = !options.validate || validate();
    if (validity !== true) {
      throw new ValidationError(validity)
    }
    const url = getUrl(options.transform);
    const anchor = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
    anchor.href = url;
    anchor.setAttribute("download", `${filename}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
</script>

<form class="jsonschema-form" data-version={ libVersion }>
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
          <ObjectProps {...dereferenced} bind:data {uischema} force />
        </Content>
      </Paper>
    {:else}
      <Control schema={dereferenced} bind:data {uischema} force />
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

  .jsonschema-form :global(.jsonschema-form-controls),
  .jsonschema-form :global(.control-anyof > .smui-paper__title) {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .jsonschema-form :global(.jsonschema-form-controls > .jsonschema-form-control),
  .jsonschema-form :global(.jsonschema-form-controls .control-anyof-select) {
    flex-basis: 325px;
  }

  :global(.smui-select__menu-portal > .mdc-select__menu) {
    width: 325px;
    max-width: 80%;
  }

  .jsonschema-form :global(.jsonschema-form-controls > .control-array),
  .jsonschema-form :global(.jsonschema-form-controls > .control-object),
  .jsonschema-form :global(.jsonschema-form-controls > .control-anyof) {
    flex-basis: 100%;
  }
</style>
 