#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import { getSidecarMetadataFixture } from '../../tests/fixtures/sidecar-metadata.fixture.js'

import {
  nativeArgs,
}                       from './native-args.js'

test('nativeArgs()', async t => {

  const fixture = getSidecarMetadataFixture()

  // console.log(fixture.nativeFunctionList.length)
  const result = fixture.nativeFunctionList
    .map(x => Object.values(x))
    .flat()
    .map(x => nativeArgs.call(x!))

  const EXPECTED_RESULT = [
    '[ anotherCall_NativeArg_0, anotherCall_NativeArg_1 ]',
    '[ testMethod_NativeArg_0, testMethod_NativeArg_1 ]',
    '[ pointerMethod_NativeArg_0 ]',
    '[  ]',
    '[  ]',
  ]
  t.same(result, EXPECTED_RESULT, 'should list the native arg names correctly.')
})
