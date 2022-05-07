#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable camelcase */
import { test }  from 'tstest'

import vm from 'vm'
import Mustache from  'mustache'

import {
  partialLookup,
}                         from '../partial-lookup.js'

import { getSidecarMetadataFixture } from '../../../tests/fixtures/sidecar-metadata.fixture.js'
import { wrapView } from '../../wrappers/mod.js'

test('render rpc-exports()', async t => {

  const SIDECAR_METADATA = getSidecarMetadataFixture()
  const view = wrapView(SIDECAR_METADATA)

  const template = await partialLookup('rpc-exports.mustache')

  // console.log(template)
  const code = Mustache.render(template, view)
  // console.log(code)

  /**
   * https://nodejs.org/api/vm.html
   */
  const context = {
    __sidecar__agentMethod_Function_wrapper   : () => {},
    __sidecar__anotherCall_Function_wrapper   : () => {},
    __sidecar__pointerMethod_Function_wrapper : () => {},
    __sidecar__testMethod_Function_wrapper    : () => {},
    __sidecar__voidMethod_Function_wrapper    : () => {},
    rpc: {
      exports: {},
    },
  }

  vm.createContext(context) // Contextify the object.
  vm.runInContext(code, context)
  t.ok('testMethod'     in context.rpc.exports, 'should export testMethod')
  t.ok('pointerMethod'  in context.rpc.exports, 'should export pointerMethod')
  t.ok('anotherCall'    in context.rpc.exports, 'should export anotherCall')
  t.ok('agentMethod'    in context.rpc.exports, 'should export agentCall')

  /**
   * Do not export Hook/Interceptor methods
   */
  t.notOk('hookMethod' in context.rpc.exports, 'should not export hookMethod')
})
