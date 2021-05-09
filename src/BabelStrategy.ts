import { $1 } from "./$1"
import { AbstractStrategy } from "./AbstractStrategy"
import { isSchemaObject } from "./isSchemaObject"
import generate from "@babel/generator"
import {
  addComment,
  classBody,
  classDeclaration,
  Declaration,
  exportAllDeclaration,
  exportNamedDeclaration,
  Identifier,
  identifier,
  importDeclaration,
  importSpecifier,
  Node,
  program,
  stringLiteral,
  tsArrayType,
  tsBooleanKeyword,
  tsNumberKeyword,
  TSPropertySignature,
  tsPropertySignature,
  tsStringKeyword,
  TSType,
  tsTypeAliasDeclaration,
  tsTypeAnnotation,
  tsTypeLiteral,
  tsTypeReference,
  tsUnknownKeyword,
} from "@babel/types"

export class BabelStrategy extends AbstractStrategy<
  Declaration,
  Identifier,
  Node,
  TSType
> {
  array(items: TSType /** , value: OpenApi.ArraySchemaObject */): TSType {
    return tsArrayType(items)
  }

  attribute<T extends Node>(node: T, value: $1): T {
    if (isSchemaObject(value)) {
      if (value.description) {
        addComment(node, "leading", `* ${value.description.trim()} `)
      }
    }

    return node
  }

  boolean(/** value: OpenApi.NonArraySchemaObject */): TSType {
    return tsBooleanKeyword()
  }

  bootstrap(filename: string): Declaration {
    return exportAllDeclaration(stringLiteral(filename))
  }

  class(id: Identifier): Declaration {
    return classDeclaration(id, undefined, classBody([]))
  }

  export(declaration: Declaration): Declaration {
    return exportNamedDeclaration(declaration)
  }

  filename(id: string): `./${string}` {
    return `./${id}.ts`
  }

  id(id: string): Identifier {
    return identifier(id)
  }

  import(id: Identifier, filename: string): Declaration {
    return importDeclaration([importSpecifier(id, id)], stringLiteral(filename))
  }

  number(/** value: OpenApi.NonArraySchemaObject */): TSType {
    return tsNumberKeyword()
  }

  object(properties: [string, $1][]): TSType {
    const predicate: (
      value: [string, $1],
      index: number,
      array: [string, $1][],
    ) => TSPropertySignature = ([id, value]) =>
      this.attribute(
        tsPropertySignature(
          this.id(id),
          tsTypeAnnotation(this.createAnnotation(value)),
        ),
        value,
      )

    return tsTypeLiteral(properties.map(predicate))
  }

  program(body: Declaration[]): string {
    return generate(program(body)).code
  }

  reference($ref: string): TSType {
    return tsTypeReference(this.id($ref))
  }

  string(/** value: OpenApi.NonArraySchemaObject */): TSType {
    return tsStringKeyword()
  }

  type(id: Identifier, annotation: TSType): Declaration {
    return tsTypeAliasDeclaration(id, undefined, annotation)
  }

  unknown(): TSType {
    return tsUnknownKeyword()
  }
}
