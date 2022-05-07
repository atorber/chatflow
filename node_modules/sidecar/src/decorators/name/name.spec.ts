#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  getParameterName,
  Name,
  PARAMETER_NAME_SYMBOL,
}                         from './name.js'

test('@Name with metadata', async t => {
  const NAME = 'test_name'

  class Test {

    method (
      test: number,
      @Name(NAME) testName: string,
    ) {
      void test
      void testName
    }

  }

  const instance = new Test()
  const data = Reflect.getMetadata(
    PARAMETER_NAME_SYMBOL,
    instance,
    'method',
  )

  /* eslint-disable no-sparse-arrays */
  const EXPECTED_DATA = [, NAME]
  t.same(data, EXPECTED_DATA, 'should get the parameter name data')
})

test('getParameterName', async t => {
  const NAME = 'test_name'

  class Test {

    method (
      test: number,
      @Name(NAME) testName: string,
    ) {
      void test
      void testName
    }

  }

  const instance = new Test()
  const nameList = [0, 1].map(i => getParameterName(
    instance,
    'method',
    i,
  ))

  const EXPECTED_NAME_LIST = [undefined, NAME]
  t.same(nameList, EXPECTED_NAME_LIST, 'should get decorated name list')
})
