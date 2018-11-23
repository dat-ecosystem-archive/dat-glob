var box = require('callbox')
var maybe = require('call-me-maybe')
var mm = require('micromatch')
var parent = require('glob-parent')
var pumpify = require('pumpify')
var through = require('through2')
var walk = require('dat-walk')

module.exports = function (dat, glob) {
  var stream = match(dat, glob)
  stream.collect = cb => collect(stream, cb)
  return stream
}

function match (dat, glob) {
  var base = Array.isArray(glob) ? '' : parent(glob)
  var walker = walk(dat, base).stream()
  var matcher = through.obj(function (chunk, enc, cb) {
    var file = chunk.toString(enc)
    if (mm.some(file, glob)) {
      this.push(Buffer.from(file, 'utf8'))
    }
    cb()
  })

  return pumpify(walker, matcher)
}

function collect (stream, cb) {
  var promise = box(done => {
    var list = []

    stream.on('data', match => {
      list.push(match.toString('utf8'))
    })

    stream.on('end', () => {
      done(null, list)
    })

    stream.on('error', done)
  })

  return maybe(cb, promise)
}
