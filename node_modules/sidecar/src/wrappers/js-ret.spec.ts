#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import { getSidecarMetadataFixture } from '../../tests/fixtures/sidecar-metadata.fixture.js'
import { jsRet } from './js-ret.js'

test('jsRet()', async t => {
  const SIDECAR_VIEW = getSidecarMetadataFixture()

  const nativeFunctionList = SIDECAR_VIEW.nativeFunctionList.map(x => Object.values(x)).flat()

  const EXPECTED_RET_LIST = [
    'ret.readPointer().readInt()',
    'ret.readPointer().readUtf8String()',
    'ret',
    'undefined /* void */',
    'ret',
  ]

  const result = nativeFunctionList
    .map(x => jsRet.call(x))

  // console.log(result)
  t.same(result, EXPECTED_RET_LIST, 'should wrap the ret correct')
})
