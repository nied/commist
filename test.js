
var test      = require('tap').test
  , commist   = require('./')
  , minimist  = require('minimist')

test('parsing as minimist', function(t) {
  var program = commist()
    , args    = ['a', 'b', 'c']

  function minitest(args) {
    t.deepEqual(program.parse(args), minimist(args))
  }

  minitest(['a', 'b', 'c'])
  minitest(['a', '-b', '-c', 23])
  minitest(['a', '-bde'])

  t.end()
})

test('registering a command', function(t) {
  t.plan(2)

  var program = commist()
    , result

  program.register('hello', function(args) {
    t.deepEqual(args, { _: ['a'], x: 23 })
  })

  result = program.parse(['hello', 'a', '-x', '23'])

  t.notOk(result, 'must return null, the command have been handled')
})

test('registering two commands', function(t) {
  t.plan(1)

  var program = commist()
    , result

  program.register('hello', function(args) {
    t.ok(false, 'must pick the right command')
  })

  program.register('world', function(args) {
    t.deepEqual(args, { _: ['a'], x: 23 })
  })

  program.parse(['world', 'a', '-x', '23'])
})

test('registering two commands (bis)', function(t) {
  t.plan(1)

  var program = commist()
    , result

  program.register('hello', function(args) {
    t.deepEqual(args, { _: ['a'], x: 23 })
  })

  program.register('world', function(args) {
    t.ok(false, 'must pick the right command')
  })

  program.parse(['hello', 'a', '-x', '23'])
})

test('registering two words commands', function(t) {
  t.plan(1)

  var program = commist()
    , result

  program.register('hello', function(args) {
    t.ok(false, 'must pick the right command')
  })

  program.register('hello world', function(args) {
    t.deepEqual(args, { _: ['a'], x: 23 })
  })

  program.parse(['hello', 'world', 'a', '-x', '23'])
})

test('registering two words commands (bis)', function(t) {
  t.plan(1)

  var program = commist()
    , result

  program.register('hello', function(args) {
    t.deepEqual(args, { _: ['a'], x: 23 })
  })

  program.register('hello world', function(args) {
    t.ok(false, 'must pick the right command')
  })

  program.parse(['hello', 'a', '-x', '23'])
})

test('registering ambiguous commands throws exception', function(t) {
  var program = commist()
    , result

  function noop() {}

  program.register('hello', noop)
  program.register('hello world', noop)
  program.register('hello world matteo', noop)

  try {
    program.register('hello world', noop)
    t.ok(false, 'must throw if double-registering the same command')
  } catch(err) {
  }

  t.end()
})

test('looking up commands', function(t) {
  var program = commist()
    , result

  function noop1() {}
  function noop2() {}
  function noop3() {}

  program.register('hello', noop1)
  program.register('hello world matteo', noop3)
  program.register('hello world', noop2)

  t.equal(program.lookup('hello')[0].func, noop1)
  t.equal(program.lookup('hello world matteo')[0].func, noop3)
  t.equal(program.lookup('hello world')[0].func, noop2)

  t.end()
})