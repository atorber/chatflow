#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  argName,
  bufName,
  nativeArgName,
  jsArgName,
}                       from './name-helpers.js'

test('bufName()', async t => {

  const TEST_LIST: [[string, number, number?], string][] = [
    [
      ['test', 0, 1],
      'test_Memory_0_1',
    ],
    [
      ['demo', 3],
      'demo_Memory_3',
    ],
  ]

  for (const [args, expected] of TEST_LIST) {
    const name = bufName(...args)
    t.equal(name, expected, `should get the expected name from "bufName(${args.join(', ')})"`)
  }
})

test('argName()', async t => {

  const TEST_LIST: [number, string][] = [
    [
      0,
      'args[0]',
    ],
    [
      3,
      'args[3]',
    ],
  ]

  for (const [idx, expected] of TEST_LIST) {
    const name = argName(idx)
    t.equal(name, expected, `should get the expected name from "argName(${idx})"`)
  }
})

test('nativeArgName()', async t => {

  const TEST_LIST: [[string, number], string][] = [
    [
      ['test', 0],
      'test_NativeArg_0',
    ],
    [
      ['demo', 3],
      'demo_NativeArg_3',
    ],
  ]

  for (const [args, expected] of TEST_LIST) {
    const name = nativeArgName(...args)
    t.equal(name, expected, `should get the expected name from "nativeArgName(${args.join(', ')})"`)
  }
})

test('jsArgName()', async t => {

  const TEST_LIST: [[string, number], string][] = [
    [
      ['test', 0],
      'test_JsArg_0',
    ],
    [
      ['demo', 3],
      'demo_JsArg_3',
    ],
  ]

  for (const [args, expected] of TEST_LIST) {
    const name = jsArgName(...args)
    t.equal(name, expected, `should get the expected name from "jsArgName(${args.join(', ')})"`)
  }
})
