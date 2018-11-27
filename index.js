var assert = require('assert')
var mm = require('micromatch')
var parent = require('glob-parent')
var walk = require('dat-walk')

module.exports = function (dat, opts) {
  opts = opts || {}
  var glob = typeof opts === 'string' || Array.isArray(opts) ? opts : opts.pattern
  var it = match(dat, glob, opts)
  it.collect = () => collect(it)
  return it
}

async function * match (dat, glob, opts) {
  assert(typeof glob === 'string' || Array.isArray(glob), 'Invalid glob pattern')
  var base = Array.isArray(glob) ? '' : parent(glob)
  var follow = opts.follow
  var file

  for await (file of walk(dat, { base, follow })) {
    if (mm.some(file, glob)) yield file
  }
}

async function collect (it) {
  var match
  var list = []

  for await (match of it) {
    list.push(match)
  }
  return list
}
