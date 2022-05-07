#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test } from 'tstest'

import type {
  TargetPayloadRaw,
  TargetPayloadObj,
}                         from '../../function-target.js'
import { Ret }            from '../../ret.js'

import {
  Call,
}                             from './call.js'
import { getMetadataCall }    from './metadata-call.js'
import { CALL_SYMBOL }        from './constants.js'

test('Call with metadata', async t => {
  const TARGET: TargetPayloadRaw = 0x42
  const METHOD_NAME = 'testMethod'

  class Test {

    @Call(TARGET) [METHOD_NAME] () { return Ret() }

  }

  const instance = new Test()
  const data = Reflect.getMetadata(
    CALL_SYMBOL,
    instance,
    METHOD_NAME,
  )

  /* eslint-disable no-sparse-arrays */
  t.same(data, TARGET, 'should get the Call target data')
})

test('getCallTarget()', async t => {
  const TARGET: TargetPayloadRaw = 0x42
  const METHOD_NAME = 'testMethod'

  class Test {

    @Call(TARGET) [METHOD_NAME] () { return Ret() }

  }

  const instance = new Test()

  const data = getMetadataCall(
    instance,
    METHOD_NAME,
  )

  t.same(data, TARGET, 'should get Call target data')
})

test('getCallTarget() with agent target', async t => {
  const TARGET: TargetPayloadObj = {
    funcName : 'test',
    type     : 'agent',
  }
  const METHOD_NAME = 'testMethod'

  class Test {

    @Call(TARGET) [METHOD_NAME] () { return Ret() }

  }

  const instance = new Test()

  const data = getMetadataCall(
    instance,
    METHOD_NAME,
  )

  t.same(data, TARGET, 'should get Call target data by agent target')
})
