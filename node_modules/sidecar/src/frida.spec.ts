#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test }       from 'tstest'

import type {
  ScriptMessageHandler,
  NativeType,
  PointerType,
}                           from './frida.js'
import {
  normalizeFunctionTarget,
  TargetPayloadObj,
  TargetPayloadRaw,
}                           from './function-target.js'

/**
 * Huan(202109): #18 - `dts` package conflict node_modules/.bin/tsc version
 *  https://github.com/huan/sidecar/issues/18
 *
 *  Testing static types in TypeScript
 *    https://2ality.com/2019/07/testing-static-types.html
 */
type AssertEqual<T, Expected> =
  T extends Expected
  ? (Expected extends T ? true : never)
  : never;

test('PointerType typing', async t => {
  type EXPECTED_TYPE = 'Pointer' | 'Int' | 'Utf8String'
  type T = Extract<PointerType, EXPECTED_TYPE>
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true
  t.ok(typeTest, 'PointerType should be typing right')
})

test('NativeType typing', async t => {
  type EXPECTED_TYPE = 'void' | 'pointer' | 'int'
  type T = Extract<NativeType, EXPECTED_TYPE>
  const typeTest: AssertEqual<T, EXPECTED_TYPE> = true
  t.ok(typeTest, 'NativeType should be typing right')
})

test('TargetType typing', async t => {
  type EXPECTED_TYPE = number | string
  const typeTest: AssertEqual<TargetPayloadRaw, EXPECTED_TYPE> = true
  t.ok(typeTest, 'TargetType should be typing right')
})

test('ScriptMessageHandler typing', async t => {
  type EXPECTED_TYPE = Buffer | null
  const handler: Parameters<ScriptMessageHandler>[1] = {} as any
  const typeTest: AssertEqual<typeof handler, EXPECTED_TYPE> = true
  t.ok(typeTest, 'ScriptMessageHandler should be typing right')
})

test('normalizeFunctionTarget()', async t => {
  const TEST_LIST: [
    TargetPayloadRaw,
    TargetPayloadObj,
  ][] = [
    [
      'stringTarget',
      { funcName: 'stringTarget', type: 'agent' },
    ],
    [
      0x42,
      { address: '0x42', moduleName: null, type: 'address' },
    ],
  ]

  const result    = TEST_LIST.map(pair => pair[0]).map(normalizeFunctionTarget)
  const expected  = TEST_LIST.map(pair => pair[1])

  t.same(result, expected, 'should normalize function target as expected')
})
