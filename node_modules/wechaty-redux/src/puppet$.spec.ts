#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}                           from 'tstest'
import { PuppetMock }       from 'wechaty-puppet-mock'
import type {
  Store,
}                           from 'redux'

import * as duck    from './duck/mod.js'
import {
  getPuppet,
}                   from './registry/mod.js'

import {
  puppet$,
}                           from './puppet$.js'

test('puppet$() & getPuppet()', async t => {
  const spy = sinon.spy()
  const puppet = new PuppetMock()

  const store = {
    dispatch: spy,
  } as any as Store

  t.notOk(getPuppet(puppet.id), 'should not have puppet in registry')

  const $ = puppet$(puppet, { store })

  const sub = $.subscribe(store.dispatch)
  t.ok(spy.calledOnce, 'should have one action after subscribe')
  t.same(spy.args[0]![0], duck.actions.REGISTER_PUPPET_COMMAND(puppet.id), 'should get puppet register action')
  t.equal(getPuppet(puppet.id), puppet, 'should have puppet in registry')

  spy.resetHistory()
  sub.unsubscribe()
  t.ok(spy.calledOnce, 'should have one action after unsubscribe')
  t.same(spy.args[0]![0], duck.actions.DEREGISTER_PUPPET_COMMAND(puppet.id), 'should get puppet deregister action')
  t.notOk(getPuppet(puppet.id), 'should not have puppet in registry')
})

test('puppet$() start/stop actions', async t => {
  const spy = sinon.spy()
  const puppet = new PuppetMock()

  const store = {
    dispatch: spy,
  } as any as Store

  const $ = puppet$(puppet, { store })
  const sub = $.subscribe(store.dispatch)

  t.ok(spy.calledOnce, 'should have one action after subscribe')
  t.same(spy.args[0]![0], duck.actions.REGISTER_PUPPET_COMMAND(puppet.id), 'should emit register puppet action')

  spy.resetHistory()
  await puppet.start()

  t.ok(spy.calledThrice, 'should have three action after start')
  t.same(spy.args[0]![0], duck.actions.STATE_ACTIVATED_EVENT(puppet.id, 'pending'), 'should emit `pending` active state action')
  t.same(spy.args[1]![0], duck.actions.STATE_ACTIVATED_EVENT(puppet.id, true), 'should emit `true` active state action')
  t.same(spy.args[2]![0], duck.actions.STARTED_EVENT(puppet.id), 'should emit start event action')

  spy.resetHistory()
  await puppet.stop()

  t.ok(spy.calledThrice, 'should have three action after stop')
  t.same(spy.args[0]![0], duck.actions.STATE_INACTIVATED_EVENT(puppet.id, 'pending'), 'should emit `pending` inactive state action')
  t.same(spy.args[1]![0], duck.actions.STATE_INACTIVATED_EVENT(puppet.id, true), 'should emit `true` inactive state action')
  t.same(spy.args[2]![0], duck.actions.STOPPED_EVENT(puppet.id), 'should emit stop event action')

  spy.resetHistory()
  sub.unsubscribe()

  t.ok(spy.calledOnce, 'should have one action after unsubscribe')
  t.same(spy.args[0]![0], duck.actions.DEREGISTER_PUPPET_COMMAND(puppet.id), 'should get puppet deregister action')
})
