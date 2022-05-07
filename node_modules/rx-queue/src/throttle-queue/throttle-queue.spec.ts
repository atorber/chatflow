#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import ThrottleQueue from './throttle-queue.js'

const EXPECTED_ITEM1 = { test: 'testing123' }
const EXPECTED_ITEM2 = { mol: 42 }
const EXPECTED_ITEM3 = 42

const THROTTLE_PERIOD_TIME = 10 // milliseconds

test('ThrottleQueue 1 item', async t => {
  const q   = new ThrottleQueue(THROTTLE_PERIOD_TIME)

  const spy = sinon.spy()
  q.subscribe(spy)

  q.next(EXPECTED_ITEM1)

  t.ok(spy.calledOnce, 'should called right after first item')
  t.deepEqual(spy.firstCall.args[0], EXPECTED_ITEM1, 'should get the first item immediately')
})

test('ThrottleQueue 2 item', async t => {
  const q = new ThrottleQueue(THROTTLE_PERIOD_TIME)

  const spy = sinon.spy()
  q.subscribe(spy)

  q.next(EXPECTED_ITEM1)
  q.next(EXPECTED_ITEM2)

  t.ok(spy.calledOnce, 'should only be called once right after next two items')
  t.deepEqual(spy.firstCall.args[0], EXPECTED_ITEM1, 'should get the first item')

  await new Promise(resolve => setTimeout(resolve, THROTTLE_PERIOD_TIME + 3))
  t.ok(spy.calledOnce, 'should drop the second call after period because of throttle')
})

test('ThrottleQueue 3 items', async t => {
  const q = new ThrottleQueue(THROTTLE_PERIOD_TIME)

  const spy = sinon.spy()
  q.subscribe(spy)

  q.next(EXPECTED_ITEM1)
  q.next(EXPECTED_ITEM2)

  await new Promise(resolve => setTimeout(resolve, THROTTLE_PERIOD_TIME + 3))

  q.next(EXPECTED_ITEM3)
  t.ok(spy.calledTwice, 'should received the third item after THROTTLE_TIME')
  t.deepEqual(spy.secondCall.args[0], EXPECTED_ITEM3, 'should received EXPECTED_ITEM3 (not the ITEM2!)')
})
