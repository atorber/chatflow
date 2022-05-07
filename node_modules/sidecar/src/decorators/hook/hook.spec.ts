#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import type { FunctionTarget } from '../../function-target.js'

import {
  Hook,
  getMetadataHook,
  HOOK_TARGET_SYMBOL,
}                         from './hook.js'

test('Hook with metadata', async t => {
  const TARGET: FunctionTarget = 0x42

  class Test {

    @Hook(TARGET) method () {}

  }

  const instance = new Test()
  const data = Reflect.getMetadata(
    HOOK_TARGET_SYMBOL,
    instance,
    'method',
  )

  /* eslint-disable no-sparse-arrays */
  t.same(data, TARGET, 'should get the hook target data')
})

test('getHookTarget()', async t => {
  const TARGET: FunctionTarget = 0x42

  class Test {

    @Hook(TARGET) method () {}

  }

  const instance = new Test()

  const data = getMetadataHook(
    instance,
    'method',
  )

  t.same(data, TARGET, 'should get hook target data')
})
