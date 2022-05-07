#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from './mod.js'

import type { AnyToUnknown, AssertEqual } from './assert-equal.js'

test('AssertEqual smoke testing', async (t) => {
  type T = string
  type EXPECTED_TYPE = string
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true

  t.ok(typeTest, 'should pass the typing test')
})

/**
 * Issue #37
 *  @link https://github.com/huan/tstest/issues/37
 */
test('AssertEqual with `never`', async (t) => {
  type T = never
  type EXPECTED_TYPE = never
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true

  t.ok(typeTest, 'should pass the typing test')
})

/**
 * Issue #36
 *  @link https://github.com/huan/tstest/issues/36
 */
test('AssertEqual with `any` and `[]`', async (t) => {
  type T = any
  type EXPECTED_TYPE = []

  type RESULT = AssertEqual<T, EXPECTED_TYPE>
  const typingTest: AssertEqual<RESULT, never> = true

  t.ok(typingTest, 'should be never for an unmatch')
})

test('AnyToUnknown for `any` and `unkonwn`', async t => {
  type T_ANY       = AnyToUnknown<any>
  type T_UNKNOWN   = AnyToUnknown<unknown>

  // $ExpectType unknown
  type UNKNOWN_TYPE = T_ANY & T_UNKNOWN
  const typingTestUnknown: AssertEqual<UNKNOWN_TYPE, unknown> = true
  t.ok(typingTestUnknown, 'should get true for `any` or `unkonwn` type')
})

test('AnyToUnknown for non-`any` and non-`unkonwn`', async t => {
  type T_BOOLEAN   = AnyToUnknown<boolean>
  type T_NULL      = AnyToUnknown<null>
  type T_OBJ       = AnyToUnknown<object>
  type T_STRING    = AnyToUnknown<string>
  type T_UNDEFINED = AnyToUnknown<undefined>
  type T_VOID      = AnyToUnknown<void>
  type T_NEVER     = AnyToUnknown<never>

  type KNOWN_TYPE = T_VOID | T_BOOLEAN | T_STRING | T_UNDEFINED | T_NULL | T_OBJ | T_NEVER
  // $ExpectType true
  type T = unknown extends KNOWN_TYPE ? never : true
  const typingTestOther:AssertEqual<T, true> = true
  t.ok(typingTestOther, 'should get true for non-any-non-unkonwn type')
})
