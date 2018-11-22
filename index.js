var mm = require('micromatch')
var parent = require('glob-parent')
var walk = require('dat-walk')

module.exports = function (dat, pattern) {
  var it = match(dat, pattern)
  it.collect = () => collect(it)
  return it
}

async function * match (dat, pattern) {
  var base = parent(pattern)
  var file

  for await (file of walk(dat, base)) {
    if (mm.isMatch(file, pattern)) yield file
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
