#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import DebounceQueue from './debounce-queue.js'

const EXPECTED_ITEM1 = { test: 'testing123' }
const EXPECTED_ITEM2 = { mol: 42 }
const EXPECTED_ITEM3 = 42

const DELAY_PERIOD_TIME = 10 // milliseconds

test('DebounceQueue 1 item', async t => {
  const q   = new DebounceQueue(DELAY_PERIOD_TIME)

  const spy = sinon.spy()
  q.subscribe(spy)

  q.next(EXPECTED_ITEM1)
  t.ok(spy.notCalled, 'should not called right after first item')

  await new Promise(resolve => setTimeout(resolve, DELAY_PERIOD_TIME + 3))
  t.ok(spy.calledOnce, 'should be called after the DELAY_PERIOD_TIME')
  t.deepEqual(spy.firstCall.args[0], EXPECTED_ITEM1, 'should get the first item immediately')
})

test('DebounceQueue 2 item', async t => {
  const q = new DebounceQueue(DELAY_PERIOD_TIME)

  const spy = sinon.spy()
  q.subscribe(spy)

  q.next(EXPECTED_ITEM1)
  q.next(EXPECTED_ITEM2)

  await new Promise(resolve => setTimeout(resolve, DELAY_PERIOD_TIME + 3))
  t.equal(spy.callCount, 1, 'should be called only once after DELAY_PERIOD_TIME because its debounced')
  t.deepEqual(spy.lastCall.args[0], EXPECTED_ITEM2, 'should get the EXPECTED_ITEM2')
})

test('DebounceQueue 3 items', async t => {
  const q = new DebounceQueue(DELAY_PERIOD_TIME)

  const spy = sinon.spy()
  q.subscribe(spy)

  q.next(EXPECTED_ITEM1)
  q.next(EXPECTED_ITEM2)

  await new Promise(resolve => setTimeout(resolve, DELAY_PERIOD_TIME + 3))

  q.next(EXPECTED_ITEM3)
  t.equal(spy.callCount, 1, 'should called once right after next(EXPECTED_ITEM3)')
  t.deepEqual(spy.lastCall.args[0], EXPECTED_ITEM2, 'the first call should receive EXPECTED_ITEM2')

  await new Promise(resolve => setTimeout(resolve, DELAY_PERIOD_TIME + 3))
  t.equal(spy.callCount, 2, 'should be called twice after the DELAY_PERIOD_TIME')
  t.deepEqual(spy.lastCall.args[0], EXPECTED_ITEM3, 'should get EXPECTED_ITEM3')
})
