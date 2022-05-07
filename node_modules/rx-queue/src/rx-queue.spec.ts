#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

// tslint:disable:no-shadowed-variable
import {
  test,
  sinon,
}           from 'tstest'

import RxQueue from './rx-queue.js'

test('RxQueue subscribe & next', async t => {
  const EXPECTED_ITEM = { test: 'testing123' }
  const spy = sinon.spy()

  const q = new RxQueue()

  q.subscribe(spy)
  q.next(EXPECTED_ITEM)

  t.ok(spy.calledOnce, 'should received 1 call')
  t.deepEqual(spy.firstCall.args[0], EXPECTED_ITEM, 'should received EXPECTED_ITEM')
})

test('RxQueue version()', async t => {
  const q = new RxQueue()
  t.ok(/^\d+\.\d+\.\d+$/.test(q.version()), 'get version')
})
