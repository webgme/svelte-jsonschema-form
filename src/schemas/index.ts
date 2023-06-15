import type { JSONSchema7 } from "json-schema";
import simpleSchema from "../schemas/simple/schema.json";
import simpleData from "../schemas/simple/data.json";
import nestedSchema from "../schemas/nested/schema.json";
import nestedData from "../schemas/nested/data.json";
import arraysSchema from "../schemas/arrays/schema.json";
import arraysData from "../schemas/arrays/data.json";

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
