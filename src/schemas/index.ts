import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import type UISchema from "$lib/UISchema";
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
import taxonomySchema from "../schemas/taxonomy/schema.json";
import taxonomyUISchema from "../schemas/taxonomy/uischema.json";
import taxonomyData from "../schemas/taxonomy/data.json"; 

export type TestSchema = {
  name: string;
  schema: JSONSchema7Definition;
  uischema?: UISchema;
  data: { [prop: string]: any };
};

export default [
  {
    name: "Simple",
    schema: simpleSchema as JSONSchema7,
    data: simpleData
  },
  {
    name: "Nested",
    schema: nestedSchema as JSONSchema7,
    data: nestedData
  },
  {
    name: "Arrays",
    schema: arraysSchema as JSONSchema7,
    data: arraysData
  },
  {
    name: "Numbers",
    schema: numbersSchema as JSONSchema7,
    data: numbersData
  },
  {
    name: "References",
    schema: referencesSchema as JSONSchema7,
    data: referencesData
  },
  {
    name: "Any Of",
    schema: <unknown>anyOfSchema as JSONSchema7,
    data: anyOfData
  },
  {
    name: "All Of",
    schema: <unknown>allOfSchema as JSONSchema7,
    data: allOfData
  },
  {
    name: "Taxonomy",
    schema: taxonomySchema,
    uischema: taxonomyUISchema,
    data: taxonomyData
  }
] as TestSchema[];
