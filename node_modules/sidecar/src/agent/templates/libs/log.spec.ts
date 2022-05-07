#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable camelcase */
import {
  test,
  sinon,
}         from 'tstest'

import cjsPayloadPkg   from './payload.cjs'
import cjsLogPkg       from './log.cjs'

const { __sidecar__payloadLog } = cjsPayloadPkg
const { log }                   = cjsLogPkg

// FIXME: Huan(202107) do not modify global settings
;(global as any)['__sidecar__payloadLog'] = __sidecar__payloadLog

test('log()', async t => {
  const spy = sinon.spy()
  /**
   * Frida `send` method
   */
  global['send'] = spy

  log.level(2)
  log.verbose('Test', 'message: %s', 'hello')

  const EXPECTED = {
    payload: {
      level: 'verbose',
      message: 'message: hello',
      prefix: 'Test',
    },
    type: 'log',
  }
  t.equal(spy.callCount, 1, 'should call spy')
  t.same(spy.args[0]![0], EXPECTED, 'should get correct payload event')
})
