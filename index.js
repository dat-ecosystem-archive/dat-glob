var mm = require('micromatch')
var parent = require('glob-parent')
var walk = require('dat-walk')

module.exports = function (dat, glob) {
  var it = match(dat, glob)
  it.collect = () => collect(it)
  return it
}

async function * match (dat, glob) {
  var base = Array.isArray(glob) ? '' : parent(glob)
  var file

  for await (file of walk(dat, base)) {
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
