import type { ErrorObject } from "ajv";

export default class ValidationError extends Error {
  errors: ErrorObject[];

  constructor(errors: ErrorObject[] | false) {
    super("Data is invalid for JSON schema");
    this.errors = errors || [];
  }
}

export type { ErrorObject };
