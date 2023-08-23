import type { JSONSchema7 } from "json-schema";
import traverse from "@json-schema-tools/traverse";

export function toClasses(classObj: { [cls: string]: boolean }) {
  return Object.entries(classObj)
    .filter(([cls, val]) => val )
    .map(([cls, val]) => cls)
    .join(" ");
}

export function isObjectSchema(schema: JSONSchema7) {
  return schema.type === "object";
}

export function hasRequired(schema: JSONSchema7) {
  let hasRequired = false;
  traverse(schema, schemaOrSubschema => {
    hasRequired ||= schemaOrSubschema.required?.length > 0;
  });
  return hasRequired;
}
