# Open API Generator

## Usage

```ts
import {
  BabelStrategy,
  Generator,
} from "@adventurous-anxiety/open-api-generator"
import schema from "./schema.json"
import { createWriteStream } from "fs"
import { Writable } from "stream"

const generator = new Generator({
  output: "./output",
  strategy: new BabelStrategy(),
})

const cache: Record<string, Writable> = Object.create(null)

const getWriteStream = (path: string) =>
  cache[path] || (cache[path] = createWriteStream(path))

generator.output.pipe(
  new Writable({
    objectMode: true,

    write({ data, path }: { data: string; path: string }, _0, callback): void {
      getWriteStream(path).write(data)
      callback()
    },
  }),
)

generator.generate(schema)
```
