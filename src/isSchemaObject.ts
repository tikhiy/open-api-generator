import { $1 } from "./$1"
import { OpenAPIV3 as OpenApi } from "openapi-types"

export const isSchemaObject = (value: $1): value is OpenApi.SchemaObject =>
  !("$ref" in value)
