#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { stringMatcher } from './string-matcher.js'

test('stringMatcher() smoke testing', async t => {
  const matcher = stringMatcher()
  t.equal(typeof matcher, 'function', 'should return a match function')
})

test('stringMatcher()', async t => {
  const TEXT_OK     = 'hello'
  const TEXT_NOT_OK = 'world'

  const falseMatcher = stringMatcher()
  t.notOk(await falseMatcher(TEXT_OK), 'should not match any string: TEXT_OK')
  t.notOk(await falseMatcher(TEXT_NOT_OK), 'should not match any string: TEXT_NOT_OK')

  const textMatcher = stringMatcher(TEXT_OK)
  t.ok(await textMatcher(TEXT_OK), 'should match expected TEXT')
  t.notOk(await textMatcher(TEXT_NOT_OK), 'should not match unexpected string')

  const textListMatcher = stringMatcher([ TEXT_OK ])
  t.ok(await textListMatcher(TEXT_OK), 'should match expected TEXT by list')
  t.notOk(await textListMatcher(TEXT_NOT_OK), 'should not match unexpected string by list')

  const regexpMatcher = stringMatcher(new RegExp(TEXT_OK))
  t.notOk(await regexpMatcher(TEXT_NOT_OK), 'should not match unexpected string by regexp')
  t.ok(await regexpMatcher(TEXT_OK), 'should match expected from by regexp')

  const regexpListMatcher = stringMatcher([ new RegExp(TEXT_OK) ])
  t.notOk(await regexpListMatcher(TEXT_NOT_OK), 'should not match unexpected string by regexp list')
  t.ok(await regexpListMatcher(TEXT_OK), 'should match expected from by regexp list')

  const stringFilter = (text: string) => text === TEXT_OK

  const functionMatcher = stringMatcher(stringFilter)
  t.notOk(await functionMatcher(TEXT_NOT_OK), 'should not match unexpected string by function')
  t.ok(await functionMatcher(TEXT_OK), 'should match expected from by function')

  const functionListMatcher = stringMatcher([ stringFilter ])
  t.notOk(await functionListMatcher(TEXT_NOT_OK), 'should not match unexpected string by function list')
  t.ok(await functionListMatcher(TEXT_OK), 'should match expected from by function list')
})
