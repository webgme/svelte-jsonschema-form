import type { JSONSchema7 } from "json-schema";
import { getContext, setContext } from 'svelte';
import { writable, type Readable } from "svelte/store";
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

    export function get() {
      return getContext<Readable<Options>>(ContextKey);
    }

    export function store(options: Options) {
      const store = writable(options);
      return setContext(ContextKey, store);
    }
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
