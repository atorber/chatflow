#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable camelcase */
import { test }  from 'tstest'
import type {
  SidecarPayloadHook,
  SidecarPayloadLog,
}                                 from '../../../sidecar-body/payload-schemas.js'

import pkg from './payload.cjs'

const {
  __sidecar__payloadHook,
  __sidecar__payloadLog,
}                           = pkg

test('__sidecar__payloadLog()', async t => {
  const message = 'test' as string

  const payload = __sidecar__payloadLog(
    'verbose',
    'Test',
    message,
  )
  const EXPECTED: SidecarPayloadLog = {
    payload : {
      level: 'verbose',
      message,
      prefix: 'Test',
    },
    type    : 'log',
  }

  t.same(payload, EXPECTED, 'should get log payload correctly')
})

test('__sidecar__payloadHook()', async t => {
  const METHOD = 'method'
  const ARGS = ['arg0', 'arg1']

  const payload = __sidecar__payloadHook(
    METHOD,
    ARGS,
  )

  const EXPECTED_PAYLOAD: SidecarPayloadHook = {
    payload: {
      args   : {},
      method : METHOD,
    },
    type: 'hook',
  }
  for (const [idx, item] of ARGS.entries()) {
    EXPECTED_PAYLOAD.payload.args[idx] = item
  }

  t.same(payload, EXPECTED_PAYLOAD, 'should make hook payload correctly.')
})
