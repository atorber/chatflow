#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import type { TypeChain } from '../../frida.js'

import {
  getMetadataParamType,
  updateMetadataParamType,
}                           from './metadata-param-type.js'

test('update & get parame type metadata', async t => {
  const PROPERTY_KEY = 'key'
  const TARGET = {
    [PROPERTY_KEY]: () => {},
  }
  const VALUE = [['pointer', 'Utf8String']] as TypeChain[]

  updateMetadataParamType(
    TARGET,
    PROPERTY_KEY,
    0,
    VALUE[0]!,
  )

  const data = getMetadataParamType(
    TARGET,
    PROPERTY_KEY,
  )

  t.same(data, VALUE, 'should get the parameter type data the same as we set(update)')
})
