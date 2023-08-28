import type { JSONSchema7 } from "json-schema";
import { getContext, setContext } from 'svelte';
import { writable, type Readable } from "svelte/store";
import { hasRequired } from "./utilities";

type UISchema = {
  collapse?: "all" | "none" | "unrequired"
};

namespace UISchema {
  export const Key = Symbol("svelte-jsonschema-form UI schema context key");

  export function get() {
    return getContext<Readable<UISchema>>(Key);
  }

  export function store(uischema: UISchema) {
    const store = writable(uischema);
    return setContext(Key, store);
  }

  export function shouldCollapse(schema: JSONSchema7, setting: UISchema['collapse'], fallback: boolean) {
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
