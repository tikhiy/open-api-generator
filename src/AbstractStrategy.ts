import { $1 } from "./$1"
import { AbstractStrategyProperties } from "./AbstractStrategyProperties"
import { isSchemaObject } from "./isSchemaObject"
import { OpenAPIV3 as OpenApi } from "openapi-types"

export abstract class AbstractStrategy<
  TDeclaration extends TNode,
  TIdentifier extends TNode,
  TNode,
  TType extends TNode,
> {
  readonly dependencies = new Set<TDeclaration>()

  abstract array(
    items: TType,
    arraySchemaObject: OpenApi.ArraySchemaObject,
  ): TType

  abstract attribute<T extends TNode>(node: T, value: $1): T

  abstract boolean(nonArraySchemaObject: OpenApi.NonArraySchemaObject): TType

  abstract bootstrap(filename: string): TDeclaration

  abstract class(id: TIdentifier): TDeclaration

  abstract export(declaration: TDeclaration): TDeclaration

  abstract filename(id: string): `./${string}`

  abstract id(id: string): TIdentifier

  abstract import(id: TIdentifier, filename: string): TDeclaration

  abstract number(nonArraySchemaObject: OpenApi.NonArraySchemaObject): TType

  abstract object(
    properties: [string, $1][],
    nonArraySchemaObject: OpenApi.NonArraySchemaObject,
  ): TType

  abstract program(body: TDeclaration[]): string

  abstract reference(
    $ref: string,
    referenceObject: OpenApi.ReferenceObject,
  ): TType

  abstract string(nonArraySchemaObject: OpenApi.NonArraySchemaObject): TType

  abstract type(id: TIdentifier, annotation: TType): TDeclaration

  abstract unknown(): TType

  constructor(readonly properties?: AbstractStrategyProperties) {}

  create$ref({ $ref }: OpenApi.ReferenceObject) {
    return $ref.split(/[#/]/g).filter(Boolean)
  }

  createAnnotation(value: $1 | null = null): TType {
    if (value !== null) {
      if (isSchemaObject(value)) {
        switch (value.type) {
          case "array":
            return this.array(this.createItems(value), value)
          case "boolean":
            return this.boolean(value)
          case "integer":
          case "number":
            return this.number(value)
          case "object":
            return this.object(this.createProperties(value), value)
          case "string":
            return this.string(value)
        }
      } else {
        const $ref = this.create$ref(value).pop()

        if ($ref) {
          this.dependencies.add(this.import(this.id($ref), this.filename($ref)))

          return this.reference($ref, value)
        }
      }
    }

    return this.unknown()
  }

  createItems(value: OpenApi.ArraySchemaObject): TType {
    return this.createAnnotation(value.items)
  }

  createProperties(value: OpenApi.NonArraySchemaObject): [string, $1][] {
    const entries = Object.entries(value.properties || {})

    const compare = ([x]: [string, $1], [y]: [string, $1]): number => {
      if (!this.properties?.keysSort?.caseSensitive) {
        x = x.toLowerCase()
        y = y.toLowerCase()
      }

      return x.localeCompare(y)
    }

    return entries.sort(compare)
  }
}
