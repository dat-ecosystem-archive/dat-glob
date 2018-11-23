# dat-glob

Glob implementation for `dat` archives.

Supports both raw `hyperdrive` instances and Beaker Browser's `DatArchive` API.

## Usage

This package exports two modules. The default `require('dat-glob')` works with async iteration, whereas `require('dat-glob/stream')` uses standard Node streams. Both modules include a `collect` method which returns a list of all matching files.

```js
// Async iteration
var glob = require('dat-glob')

async function main () {
  var dat = await DatArchive.create()

  for await (var file of glob(dat, '**/*.json')) {
    console.log(file) // 'dat.json'
  }

  var files = await glob(dat, '**/*.json').collect()
  console.log(files) // ['dat.json']
}

main()

// Node stream
var hyperdrive = require('hyperdrive')
var glob = require('dat-glob/stream')

var dat = hyperdrive(key)
var stream = glob(dat, ['*.json', 'subdir/*.json'])

stream.pipe(process.stdout)

stream.collect((err, files) => {
  console.log(files)
})
```

## License

Apache-2.0
