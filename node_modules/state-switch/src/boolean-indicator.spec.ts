#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import {
  test,
  sinon,
}           from 'tstest'

import { BooleanIndicator } from './boolean-indicator.js'

test('BooleanIndicator init state', async t => {
  const indicator = new BooleanIndicator()

  t.equal(indicator.value(), false, 'should not be not true after init')
  await t.resolves(() => indicator.ready(false), 'should be idle after init')
})

test('BooleanIndicator set true', async t => {
  const sandbox = sinon.createSandbox()
  const spy = sandbox.spy()

  const indicator = new BooleanIndicator()

  indicator.value(true)
  t.equal(indicator.value(), true, 'should not be true after set true')

  indicator.ready(false).then(spy).catch(e => t.fail(e))
  await new Promise(setImmediate)
  t.equal(spy.callCount, 0, 'should not resolve ready(false) when true')

  sandbox.restore()
})

test('BooleanIndicator state transition', async t => {
  const sandbox = sinon.createSandbox()
  const spy = sandbox.spy()

  const indicator = new BooleanIndicator()

  indicator.value(true)
  indicator.ready(false).then(spy).catch(e => t.fail(e))
  await new Promise(setImmediate)
  t.equal(spy.callCount, 0, 'should not resolve ready(false) when true')

  indicator.value(false)
  await new Promise(setImmediate)
  t.equal(spy.callCount, 1, 'should resolve ready(false) when set to false')
})
