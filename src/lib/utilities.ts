import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import traverse from "@json-schema-tools/traverse";

export function toClasses(classObj: { [cls: string]: boolean }) {
  return Object.entries(classObj)
    .filter(([cls, val]) => val )
    .map(([cls, val]) => cls)
    .join(" ");
}

export function isSchemaType(type: JSONSchema7TypeName, { type: types }: JSONSchema7) {
  return (Array.isArray(types) ? types[0] : types) === type;
}

export function isObjectSchema(schema: JSONSchema7) {
  return isSchemaType("object", schema);
}

export function isArraySchema(schema: JSONSchema7) {
  return isSchemaType("array", schema);
}

export function hasRequired(schema: JSONSchema7) {
  let hasRequired = false;
  traverse(schema, schemaOrSubschema => {
    hasRequired ||= schemaOrSubschema.required?.length > 0;
  });
  return hasRequired;
}

export function isBoolean(arg: any): arg is boolean {
  return typeof arg === "boolean";
}

export function isString(arg: any): arg is string {
  return typeof arg === "string";
}

export function omit<T extends Record<any, any>, K extends keyof T>(obj: T, keys: K[]) {
  return Object.keys(obj)
    .filter(key => !keys.includes(key as K))
    .reduce((acc, key) => {
      acc[key as keyof typeof acc] = obj[key];
      return acc;
    }, {} as Omit<T, K>)
}

export function isDefined<T>(value: T | undefined): value is T {
  return (value != null) || (value === null);
}

export function isEmpty(obj: { [key: string]: any }) {
  return Object.entries(obj)
    .filter(([_, val]) => isDefined(val))
    .length === 0;
}
