import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import ajvFormats from "ajv-formats";

const ajv = new Ajv()
ajvFormats(ajv)

export default ajv

export class ValidationError extends Error {
  errors: ErrorObject[]

  constructor(errors: ErrorObject[] | false) {
    super("Data is invalid for JSON schema");
    this.errors = errors || []
  }
}

export type { ErrorObject, ValidateFunction }
