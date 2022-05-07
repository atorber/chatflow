#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  RetType,
}                     from './ret-type.js'
import {
  getMetadataRetType,
}                     from './metadata-ret-type.js'
import {
  RET_TYPE_SYMBOL,
}                     from './constants.js'

test('RetType with metadata', async t => {
  const NATIVE_TYPE       = 'pointer'
  const POINTER_TYPE_LIST = ['Pointer', 'Utf8String'] as const

  class Test {

    @RetType(
      NATIVE_TYPE,
      ...POINTER_TYPE_LIST,
    )
    method (): string { return '' }

  }

  const instance = new Test()
  const data = Reflect.getMetadata(
    RET_TYPE_SYMBOL,
    instance,
    'method',
  )

  /* eslint-disable no-sparse-arrays */
  const EXPECTED_DATA = [
    NATIVE_TYPE,
    ...POINTER_TYPE_LIST,
  ]
  t.same(data, EXPECTED_DATA, 'should get the method ret type data')
})

test('getRetType()', async t => {
  const NATIVE_TYPE       = 'pointer'
  const POINTER_TYPE_LIST = ['Pointer', 'Utf8String'] as const

  class Test {

    @RetType(
      NATIVE_TYPE,
      ...POINTER_TYPE_LIST,
    )
    method (): string { return '' }

  }

  const instance = new Test()
  const typeList = getMetadataRetType(
    instance,
    'method',
  )

  const EXPECTED_NAME_LIST = [
    NATIVE_TYPE,
    ...POINTER_TYPE_LIST,
  ]
  t.same(typeList, EXPECTED_NAME_LIST, 'should get decorated method ret type list')
})

test('guard ret native types', async t => {
  const NATIVE_TYPE = 'pointer'

  const getFixture = () => {
    class Test {

      @RetType(NATIVE_TYPE)
      testMethod (): number {
        return 42
      }

    }

    return Test
  }

  t.throws(getFixture, 'should throw because the RetType(pointer) is not match the design type `number`')
})
