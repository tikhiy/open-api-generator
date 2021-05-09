import { AbstractStrategy } from "./AbstractStrategy"
import { GeneratorOptions } from "./GeneratorOptions"
import { OpenAPIV3 as OpenApi } from "openapi-types"
import { resolve } from "path"
import { Readable } from "stream"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Generator<TStrategy extends AbstractStrategy<any, any, any, any>> {
  readonly output = new Readable({ objectMode: true })

  strategy: TStrategy

  constructor(readonly properties: GeneratorOptions<TStrategy>) {
    this.strategy = properties.strategy
  }

  generate({ components }: OpenApi.Document) {
    const body = Object.entries(components?.schemas || {}).map(
      ([id, value]) => {
        const annotation = this.strategy.createAnnotation(value)
        const filename = this.strategy.filename(id)

        const body = [
          ...this.strategy.dependencies,
          this.strategy.export(
            this.strategy.type(this.strategy.id(id), annotation),
          ),
        ]

        this.push({
          data: this.strategy.program(body),
          path: resolve(this.properties.output, filename),
        })

        this.strategy.dependencies.clear()

        return this.strategy.bootstrap(filename)
      },
    )

    this.push({
      data: this.strategy.program(body),
      path: resolve(this.properties.output, this.strategy.filename("index")),
    })

    this.push()
  }

  protected push(chunk: { data: string; path: string } | null = null) {
    this.output.push(chunk)
  }
}
