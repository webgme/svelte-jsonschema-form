import type { JSONSchema7 } from "json-schema";
import simpleSchema from "../schemas/simple/schema.json";
import simpleData from "../schemas/simple/data.json";
import nestedSchema from "../schemas/nested/schema.json";
import nestedData from "../schemas/nested/data.json";
import arraysSchema from "../schemas/arrays/schema.json";
import arraysData from "../schemas/arrays/data.json";
import numbersSchema from "../schemas/numbers/schema.json";
import numbersData from "../schemas/numbers/data.json";
import referencesSchema from "../schemas/references/schema.json";
import referencesData from "../schemas/references/data.json";
import anyOfSchema from "../schemas/any-of/schema.json";
import anyOfData from "../schemas/any-of/data.json";
import allOfSchema from "../schemas/all-of/schema.json";
import allOfData from "../schemas/all-of/data.json";

export const simple = {
  schema: simpleSchema as JSONSchema7,
  data: simpleData
}

export const nested = {
  schema: nestedSchema as JSONSchema7,
  data: nestedData
}

export const arrays = {
  schema: arraysSchema as JSONSchema7,
  data: arraysData
}

export const numbers = {
  schema: numbersSchema as JSONSchema7,
  data: numbersData
};

export const references = {
  schema: referencesSchema as JSONSchema7,
  data: referencesData
};

export const anyOf = {
  schema: <unknown>anyOfSchema as JSONSchema7,
  data: anyOfData
};

export const allOf = {
  schema: <unknown>allOfSchema as JSONSchema7,
  data: allOfData
};
