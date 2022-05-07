#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  ParamType,
}                         from './param-type.js'
import {
  getMetadataParamType,
}                         from './metadata-param-type.js'
import {
  PARAM_TYPE_SYMBOL,
}                         from './constants.js'

test('ParamType with metadata', async t => {
  const NATIVE_TYPE       = 'pointer'
  const POINTER_TYPE_LIST = ['Pointer', 'Utf8String'] as const

  class Test {

    method (
      n: number,
      @ParamType(
        NATIVE_TYPE,
        ...POINTER_TYPE_LIST,
      ) content: string,
    ) {
      void n
      void content
    }

  }

  const instance = new Test()
  const data = Reflect.getMetadata(
    PARAM_TYPE_SYMBOL,
    instance,
    'method',
  )

  /* eslint-disable no-sparse-arrays */
  const EXPECTED_DATA = [, [
    NATIVE_TYPE,
    ...POINTER_TYPE_LIST,
  ]]
  t.same(data, EXPECTED_DATA, 'should get the parameter type data')
})

test('getParamType', async t => {
  const NATIVE_TYPE       = 'pointer'
  const POINTER_TYPE_LIST = ['Pointer', 'Utf8String'] as const

  class Test {

    method (
      n: number,
      @ParamType(
        NATIVE_TYPE,
        ...POINTER_TYPE_LIST,
      ) content: string,
    ) {
      void n
      void content
    }

  }

  const instance = new Test()
  const typeList = getMetadataParamType(
    instance,
    'method',
  )

  const EXPECTED_NAME_LIST = [, [
    NATIVE_TYPE,
    ...POINTER_TYPE_LIST,
  ]]
  t.same(typeList, EXPECTED_NAME_LIST, 'should get decorated parameter type list')
})

test('guard parameter native types', async t => {
  const NATIVE_TYPE       = 'pointer'
  const POINTER_TYPE_LIST = ['Pointer', 'Utf8String'] as const

  const getFixture = () => {
    class Test {

      method (
        n: number,
        @ParamType(
          NATIVE_TYPE,
          ...POINTER_TYPE_LIST,
        ) content: number,
      ) {
        void n
        void content
      }

    }

    return Test
  }

  // getFixture()
  t.throws(getFixture, 'should throw because the ParamType(pointer) is not match the design type `number`')
})
