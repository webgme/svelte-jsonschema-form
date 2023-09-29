import type { JSONSchema7 } from "json-schema";
import { getContext, setContext } from 'svelte';
import { writable, type Readable, derived } from "svelte/store";
import { hasRequired } from "./utilities";

type UISchemaComponent<T extends string = string> =
  (T extends typeof UISchema.Options.Key ? never : { [key: string]: UISchemaComponent<T> }) &
  { [UISchema.Options.Key]?: UISchema.Options };

type UISchema = UISchemaComponent;

namespace UISchema {
  export type Options = {
    collapse?: UISchema.Options.Collapse
    ignoreEmpty?: boolean
  };

  export namespace Options {
    export const Key = ":ui:";
    export const ContextKey = Symbol("svelte-jsonschema-form UI schema context key");
    export type Collapse = "all" | "none" | "unrequired" | undefined;

    export function get(uischema?: UISchema) {
      const rootOpts = getContext<Readable<Options>>(ContextKey);
      const opts = uischema?.[Key];
      return derived(rootOpts, $rootOpts => ({ ...$rootOpts, ...opts }));
    }
  }

  export function store(uischema: UISchema) {
    const options = uischema?.[Options.Key] ?? {};
    const store = writable(options);
    return setContext(Options.ContextKey, store);
  }

  export function shouldCollapse(schema: JSONSchema7, setting: Options.Collapse, fallback: boolean) {
    switch (setting) {
      case "all":
        return true;
      case "none":
        return false;
      case "unrequired":
        return !hasRequired(schema);
    }
    return fallback;
  }
}

export default UISchema;
