#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import type {
  NativeType,
  PointerType,
}               from '../../frida.js'

import {
  guardRetType,
}                         from './guard-ret-type.js'

test('guard ret type', async t => {

  const triggerMetadata = (..._args: any[]) => {}

  class Test {

    // metadata will only be set when we have a decorator
    @triggerMetadata
    syncMethod (): string { // <--- `string` should be native type `pointer`
      return ''
    }

    @triggerMetadata
    asyncMethod (): Promise<string> {
      return Promise.resolve('')
    }

  }

  const test = new Test()

  const EXPECTED_RESULTS: [
    string,
    NativeType,
    PointerType,
    boolean,    // `true` if the native type is compatible, `false` otherwise
  ][] = [
    ['syncMethod', 'int', 'Int', false],
    ['syncMethod', 'pointer', 'Utf8String', true],

    ['asyncMethod', 'pointer', 'Utf8String', true],
    ['asyncMethod', 'int', 'Int', false],
  ]

  for (const [method, nativeType, pointerType, shouldMatch] of EXPECTED_RESULTS) {
    if (shouldMatch) {
      guardRetType(
        test,
        method,
        nativeType,
        [pointerType],
      )
      t.pass('should not throw for method/nativeType: ' + method + '/' + nativeType)
    } else {
      t.throws(() => guardRetType(
        test,
        'method',
        nativeType,
        [pointerType],
      ), 'should throw for method/nativeType: ' + method + '/' + nativeType)
    }
  }
})
