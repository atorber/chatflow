#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import type {
  NativeType,
  PointerType,
}               from './frida.js'

import {
  guardNativeType,
  guardPointerType,
  ReflectedDesignType,
}                     from './type-guard.js'

test('guardNativeType()', async t => {
  const DESIGN_NATIVE_PAIR_LIST:[
    ReflectedDesignType,
    NativeType,
    boolean,  // expected match result
  ][] = [
    [String, 'pointer', true],
    [Boolean, 'bool', true],
    [Number, 'int', true],
    [undefined, 'void', true],
    [undefined, 'pointer', true], // Huan(202107): 'pointer' with `null` value

    // Huan(202107): Number might be a point to the number.
    // Need to check the PointerType to make sure it is a number.
    [Number, 'pointer', true],

    [String, 'char', false],
    [undefined, 'char', false],
    [Boolean, 'int', false],
  ]

  for (const [designType, nativeType, shouldMatch] of DESIGN_NATIVE_PAIR_LIST) {
    if (shouldMatch) {
      t.doesNotThrow(() => guardNativeType(nativeType)(designType), [
        'should not throw when match:',
        `"${designType?.name}" <> "${nativeType}"`,
      ].join(' '))
    } else {
      t.throws(() => guardNativeType(nativeType)(designType), [
        'should throw when does not match:',
        `"${designType?.name}" <> "${nativeType}"`,
      ].join(' '))
    }
  }
})

test('guardPointerType()', async t => {
  const DESIGN_POINTER_PAIR_LIST:[
    ReflectedDesignType,
    PointerType,
    boolean,  // expected match result
  ][] = [
    [String,  'Utf8String', true],
    [Boolean, 'Int', true],
    [Number,  'Long', true],
    /**
     * Huan(202107): it is no sense for `void` has a pointer type:
     *  we just do not check it for convenience. (by setting match to `true`)
     */
    [undefined, 'U8',       true],

    [Number,    'Pointer',  false],
    [String,    'U32',      false],
  ]

  for (const [designType, pointerType, shouldMatch] of DESIGN_POINTER_PAIR_LIST) {
    if (shouldMatch) {
      t.doesNotThrow(() => guardPointerType([pointerType])(designType), [
        'should not throw when match:',
        `"${designType?.name}" <> "${pointerType}"`,
      ].join(' '))
    } else {
      t.throws(() => guardPointerType([pointerType])(designType), [
        'should throw when does not match:',
        `"${designType?.name}" <> "${pointerType}"`,
      ].join(' '))
    }
  }
})
