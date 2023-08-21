import type { JSONSchema7 } from "json-schema";

export function toClasses(classObj: { [cls: string]: boolean }) {
  return Object.entries(classObj)
    .filter(([cls, val]) => val )
    .map(([cls, val]) => cls)
    .join(" ");
}

export function isObjectSchema(schema: JSONSchema7) {
  return schema.type === "object";
}
