var box = require('callbox')
var maybe = require('call-me-maybe')
var mm = require('micromatch')
var parent = require('glob-parent')
var pumpify = require('pumpify')
var through = require('through2')
var walk = require('dat-walk')

module.exports = function (dat, pattern) {
  var stream = match(dat, pattern)
  stream.collect = cb => collect(stream, cb)
  return stream
}

function match (dat, pattern) {
  var base = parent(pattern)
  var walker = walk(dat, base).stream()
  var matcher = through.obj(function (chunk, enc, cb) {
    var file = chunk.toString(enc)
    if (mm.isMatch(file, pattern)) {
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
