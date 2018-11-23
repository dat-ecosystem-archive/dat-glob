/* global DatArchive */

var Fs = require('./node_modules/scoped-fs')
var test = require('./node_modules/tape')

test('stream: basic', t => {
  var glob = require('./stream')
  var dat = new Fs('./node_modules')

  var stream = glob(dat, '**/*.md')

  stream.on('data', match => {
    t.ok(/\.md$/.test(match), match)
  })

  stream.on('end', t.end)
  stream.on('error', t.end)
})

test('stream: collect', async t => {
  var glob = require('./stream')
  var dat = await mock()

  var list = await glob(dat, ['*.json', '**/*.md']).collect()
  t.ok(list.includes('dat.json'))
  t.ok(list.includes('subdir/ping.md'))
  t.end()
})

test('iterator', async t => {
  var glob = require('./')
  var dat = await mock()

  for await (var match of glob(dat, '**/*.json')) {
    t.ok(match !== 'subdir/ping.md' && /\.json$/.test(match), match)
  }

  var list = await glob(dat, ['*.json', '**/*.md']).collect()
  t.ok(list.includes('dat.json'))
  t.ok(list.includes('subdir/ping.md'))
  t.end()

  window.close()
})

async function mock () {
  var dat = await DatArchive.create()
  var files = [
    'subdir/one.json',
    'subdir/two.json',
    'subdir/ping.md'
  ]

  await dat.mkdir('subdir')
  for await (var file of files) {
    await dat.writeFile(file, '')
  }
  return dat
}
