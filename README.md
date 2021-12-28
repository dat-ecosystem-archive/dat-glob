[![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](https://dat-ecosystem.org/) 

More info on active projects and modules at [dat-ecosystem.org](https://dat-ecosystem.org/) <img src="https://i.imgur.com/qZWlO1y.jpg" width="30" height="30" /> 

---

# dat-glob

Glob implementation for `dat` archives.

Supports both raw `hyperdrive` instances and Beaker Browser's `DatArchive` API. With [`scoped-fs`](https://github.com/pfrazee/scoped-fs) you can use it on your local file system as well.

## Installation

In [Beaker](https://beakerbrowser.com) or [Webrun](https://github.com/RangerMauve/webrun) you can import the module directly in your code:

```js
import glob from 'dat://brecht.pamphlets.me/lib/dat-glob/v1.3.js'
```

Note that it's advised to always use the `dat` protocol for this. HTTPS might be fine for testing, but I can't guarantee the required reliability and performance for production usage.

If you need `dat-glob` in Node.js, you can get it from NPM:

```sh
npm install dat-glob
```

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

## API

### var results = glob(dat, pattern)

#### dat

Type: `object` (required)

A `DatArchive`, `hyperdrive`, or `scoped-fs` instance.

#### pattern

Type: `string` or `Array` (required)

A pattern (or list of patterns) to match against the files in the archive.

### var results = glob(dat, opts)

#### dat

See above.

#### opts.pattern

See above.

#### opts.base

Type: `string`

Subdirectory to start searching from.

#### opts.dir

Type: `boolean` (default: `false`)

Determines if `glob` matches directories as well as files.

### results.collect([callback])

Type: `function`

Returns `Promise` if no callback is passed in.

Collects all the files matched by the glob stream/iterator in an array.

## License

Apache-2.0
