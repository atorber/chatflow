#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import type {
  NativeType,
  PointerType,
}                 from '../../frida.js'

import {
  getMetadataRetType,
  updateMetadataRetType,
}                 from './metadata-ret-type.js'

test('update & get ret type metadata', async t => {
  const PROPERTY_KEY = 'key'
  const TARGET = {
    [PROPERTY_KEY]: () => {},
  }
  const VALUE = ['pointer', 'Utf8String'] as [NativeType, ...PointerType[]]

  updateMetadataRetType(
    TARGET,
    PROPERTY_KEY,
    VALUE,
  )

  const data = getMetadataRetType(
    TARGET,
    PROPERTY_KEY,
  )

  t.same(data, VALUE, 'should get the ret type data the same as we set(update)')
})
