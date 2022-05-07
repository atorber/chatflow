#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}             from 'tstest'

import { StateSwitch } from './state-switch.js'

test('active()', async t => {
  const ss = new StateSwitch()

  t.ok(ss.inactive(), 'default is not active')

  ss.active('pending')
  t.equal(ss.active(), 'pending', 'should be state pending')

  ss.active(true)
  t.equal(ss.active(), true, 'should be active `true`')
  t.notOk(ss.inactive(), 'should not inactive')

  ss.inactive(true)
  t.notOk(ss.active(), 'should not active after call inactive(true)')
})

test('inactive()', async t => {
  const ss = new StateSwitch()

  t.ok(ss.inactive(), 'default is inactive')
  t.equal(ss.inactive(), true, 'should in state true')

  ss.inactive('pending')
  t.equal(ss.inactive(), 'pending', 'should be state pending')

  ss.inactive(true)
  t.equal(ss.inactive(), true, 'should be state true')
  t.notOk(ss.active(), 'should not active')

  ss.active(true)
  t.notOk(ss.inactive(), 'should not inactive after called active()')
})

test('pending', async t => {
  const ss = new StateSwitch()

  t.notOk(ss.pending(), 'default is not pending')

  ss.active('pending')
  t.ok(ss.pending(), 'should in pending state')

  ss.active(true)
  t.notOk(ss.pending(), 'should not in pending state')

  ss.inactive('pending')
  t.ok(ss.pending(), 'should in pending state')
})

test('name', async t => {
  const CLIENT_NAME = 'StateSwitchTest'
  const ss = new StateSwitch(CLIENT_NAME)

  t.equal(ss.name(), CLIENT_NAME, 'should get the same client name as init')
})

test('version()', async t => {
  const ss = new StateSwitch()
  t.ok(ss.version(), 'should get version')
})

test('stable()', async t => {
  const spy = sinon.spy()

  const ss = new StateSwitch()

  ss.stable('inactive').then(() => spy('inactive')).catch(() => t.fail('rejection'))
  await new Promise(resolve => setImmediate(resolve))
  t.equal(spy.callCount, 1, 'should be stable for inactive at the initial state')

  spy.resetHistory()
  await t.rejects(() => ss.stable('active', true), 'should catch the exception when noCross=true')

  spy.resetHistory()
  const future = t.resolves(() => ss.stable('active'), 'should stable(active)')
  ss.active(true)
  await future

  spy.resetHistory()
  await t.resolves(() => ss.stable('active'), 'should stable(active) when already on')

  spy.resetHistory()
  ss.stable('inactive').then(() => spy('inactive')).catch(() => t.fail('rejection'))
  await new Promise(resolve => setImmediate(resolve))
  t.equal(spy.callCount, 0, 'should not stable(inactive) when its on')

  ss.inactive(true)
  await new Promise(resolve => setImmediate(resolve))
  t.equal(spy.callCount, 1, 'should stable(inactive) after call inactive(true)')
})

test('stable() without default arg for waiting current state', async t => {
  const spy = sinon.spy()
  const ss = new StateSwitch()

  ss.inactive('pending')
  ss.stable().then(() => spy('inactive')).catch(() => t.fail('rejection'))
  ss.inactive(true)
  await new Promise(resolve => setImmediate(resolve))
  t.equal(spy.callCount, 1, 'should be stable() for inactive(true)')

  spy.resetHistory()

  ss.active('pending')
  ss.stable().then(() => spy('active')).catch(() => t.fail('rejection'))
  ss.active(true)
  await new Promise(resolve => setImmediate(resolve))
  t.equal(spy.callCount, 1, 'should be stable() for active(true)')
})

test('active/inactive events emitting', async t => {
  const spyActive  = sinon.spy()
  const spyInactive = sinon.spy()

  const ss = new StateSwitch()

  ss.addListener('active',  spyActive)
  ss.addListener('inactive', spyInactive)

  t.ok(spyActive.notCalled, 'spyActive is not called')
  t.ok(spyInactive.notCalled, 'spyInactive is not called')

  ss.active('pending')
  t.ok(spyActive.calledOnce, 'spyActive is called once after on(pending)')
  t.same(spyActive.args[0], ['pending'], 'spyActive should be called with `pending` arg')
  t.ok(spyInactive.notCalled, 'spyInactive is not called')

  ss.active(true)
  t.ok(spyActive.calledTwice, 'spyActive is called once after active(pending)')
  t.same(spyActive.args[1], [true], 'spyActive should be called with `true` arg')
  t.ok(spyInactive.notCalled, 'spyInactive is not called')

  ss.inactive('pending')
  await Promise.resolve()
  t.ok(spyInactive.calledOnce, 'spyInactive is called once after inactive(pending)')
  t.same(spyInactive.args[0], ['pending'], 'spyInactive should be called with `pending` arg')

  ss.inactive(true)
  t.ok(spyInactive.calledTwice, 'spyInactive is called twice after inactive(true)')
  t.same(spyInactive.args[1], [true], 'spyInactive should be called with `true` arg')

  t.ok(spyActive.calledTwice, 'spyActive called twice at last')
})
