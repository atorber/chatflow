#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import {
  detectLanguage,
  includeLanguage,
  languageMatcher,
}                     from './language-matcher.js'

test('detectLanguage()', async t => {
  const ENGLISH_TEXT = 'hello'

  const resultList = detectLanguage(ENGLISH_TEXT)
  t.ok(Array.isArray(resultList), 'should return a array')
  t.ok(resultList.length > 0, 'should get a non-empty array')
})

test('includeLanguage()', async t => {
  const CHINESE_TEXT = '你好'
  const ENGLISH_TEXT = 'hello'

  let resultList = detectLanguage(CHINESE_TEXT)
  // console.info(resultList)
  t.ok(includeLanguage(resultList, 'chinese'), 'should detect Chinese language')

  resultList = detectLanguage(ENGLISH_TEXT)
  // console.info(resultList)
  t.ok(includeLanguage(resultList, 'english'), 'should detect English language')
})

test('languageMatcher()', async t => {
  const CHINESE_TEXT = '你好'
  const ENGLISH_TEXT = 'hello'

  const matchLanguage = languageMatcher('chinese')

  let result = matchLanguage(CHINESE_TEXT)
  t.ok(result, 'should match Chinese language')

  result = matchLanguage(ENGLISH_TEXT)
  t.notOk(result, 'should not match English language')
})

test('languageMatcher() with array options', async t => {
  const CHINESE_TEXT = '你好'
  const ENGLISH_TEXT = 'hello'

  const matchLanguage = languageMatcher([ 'chinese', 'english' ])

  let result = matchLanguage(CHINESE_TEXT)
  t.ok(result, 'should match Chinese language')

  result = matchLanguage(ENGLISH_TEXT)
  t.ok(result, 'should match English language')
})
