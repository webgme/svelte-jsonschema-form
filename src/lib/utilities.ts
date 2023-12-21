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

export function getLabel(schema: JSONSchema7, fallback?: string | number) {
  const { title, const: constValue } = schema;
  const constTitle = !(Array.isArray(constValue) || isObject(constValue)) ? constValue?.toString() : undefined;
  const fbTitle = (fallback != null) ? isString(fallback) ? fallback : `Option ${fallback}` : null;
  return title ?? constTitle ?? fbTitle;
}

export function isBoolean(arg: any): arg is boolean {
  return typeof arg === "boolean";
}

export function isString(arg: any): arg is string {
  return typeof arg === "string";
}

export function isObject(arg: any): arg is object {
  return Object.prototype.toString.call(arg) === '[object Object]';
}

/**
 * Omits properties from the given object.
 *
 * @param obj The object to omit properties from
 * @param keys The array of property keys to omit from the object
 * @param [options] Options for the omit function:
 *  {
 *    keepUnchanged: True to return the original object if no properties were omitted. Defaults to false.
 *  }
 * @return An object with the given properties omitted
 */
export function omit<T extends Record<any, any>, K extends keyof T>(obj: T, keys: K[], options?: { keepUnchanged: boolean }) {
  const { keepUnchanged = false } = options ?? {};
  const objKeys = Object.keys(obj);
  const keepKeys = objKeys.filter(key => !keys.includes(key as K));
  const keepObj = (keepKeys.length === objKeys.length) && keepUnchanged;
  return keepObj ? obj : keepKeys.reduce((acc, key) => {
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
