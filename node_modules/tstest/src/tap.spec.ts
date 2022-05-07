#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from './tap.js'

test('test smoke testing', async t => {
  t.ok('test is ok')
})

// test.only('test smoke testing', async t => {
//   t.ok('test is ok')
// })

test.skip('test smoke testing', async t => {
  t.ok('test is ok')
})
