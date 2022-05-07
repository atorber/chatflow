#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import type {
  NativeType,
  PointerType,
}                 from '../../frida.js'

import {
  guardParamType,
}                         from './guard-param-type.js'

test('guard parame type', async t => {

  /**
   * Huan(202106) decorator metadata is emitted only on decorated members
   *  https://stackoverflow.com/questions/51493874/typescript-emits-no-decorator-metadata/51493888#51493888
   */
  const d = (..._args: any[]) => {}

  class Test {

    @d
    method (s: string): void {
      void s
    }

  }

  const test = new Test()

  const EXPECTED_RESULTS: [
    NativeType,
    PointerType,
    boolean,
  ][] = [
    ['int', 'Int', false],
    ['pointer', 'Utf8String', true],
  ]

  for (const [nativeType, pointerType, shouldMatch] of EXPECTED_RESULTS) {
    if (shouldMatch) {
      guardParamType(
        test,
        'method',
        0,
        nativeType,
        [pointerType],
      )
      t.pass('should not throw for nativeType: ' + nativeType)
    } else {
      t.throws(() => guardParamType(
        test,
        'method',
        0,
        nativeType,
        [pointerType],
      ), 'should throw for nativeType: ' + nativeType)
    }
  }
})
