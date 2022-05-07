#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}                           from 'tstest'
import { Subject }          from 'rxjs'
import { PuppetMock }       from 'wechaty-puppet-mock'
import { WechatyBuilder }   from 'wechaty'
import type {
  Store,
}                           from 'redux'

import * as duck from '../duck/mod.js'

import {
  registerPuppetInRegistry,
  decreasePuppetReferenceInRegistry,
  increasePuppetReferenceInRegistry,
  puppetRef,
}                           from './register-puppet.js'

test('increasePuppetReferenceInRegistry() & decreasePuppetReferenceInRegistry()', async t => {
  const puppet = new PuppetMock()
  const registry   = new Map()

  t.equal(registry.size, 0, 'should be 0 puppet in the registry at initial')
  t.equal(puppetRef.size, 0, 'should be 0 puppet in ref at initial')

  let counter

  counter = increasePuppetReferenceInRegistry(registry)(puppet)
  t.equal(counter, 1, 'should be 1 ref after remember once')
  t.equal(registry.size, 1, 'should be 1 puppet in the registry after remember once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after remember once')
  t.equal(registry.get(puppet.id), puppet, 'should get puppet from the registry after remember once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after remember once')

  counter = increasePuppetReferenceInRegistry(registry)(puppet)
  t.equal(counter, 2, 'should be 2 ref after remember twice')
  t.equal(registry.size, 1, 'should be 1 puppet in the registry after remember twice')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after remember twice')
  t.equal(registry.get(puppet.id), puppet, 'should get puppet from the registry after remember twice')
  t.equal(puppetRef.get(puppet.id), 2, 'should get 2 puppet ref after remember twice')

  counter = decreasePuppetReferenceInRegistry(registry)(puppet)
  t.equal(counter, 1, 'should be 1 ref after forget once')
  t.equal(registry.size, 1, 'should be 1 puppet in the registry after forget once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after forget once')
  t.equal(registry.get(puppet.id), puppet, 'should get puppet from the registry after forget once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after forget once')

  counter = decreasePuppetReferenceInRegistry(registry)(puppet)
  t.equal(counter, 0, 'should be 1 ref after forget twice')
  t.equal(registry.size, 0, 'should be 1 puppet in the registry after forget twice')
  t.equal(puppetRef.size, 0, 'should be 1 puppet in ref after forget twice')
})

test('registerPuppetInRegistry()', async t => {
  const spy    = sinon.spy()
  const puppet = new PuppetMock()
  const registry   = new Map()

  const $ = new Subject().pipe(
    registerPuppetInRegistry(registry)(puppet),
  )

  t.equal(registry.size, 0, 'should be 0 puppet in the registry at initial')
  t.equal(puppetRef.size, 0, 'should be 0 puppet in ref at initial')

  const sub1 = $.subscribe(spy)
  t.equal(registry.size, 1, 'should be 1 puppet in the registry after subscribe once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after subscribe once')
  t.equal(registry.get(puppet.id), puppet, 'should get puppet from the registry after subscribe once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after subscribe once')

  const sub2 = $.subscribe(spy)
  t.equal(registry.size, 1, 'should be 1 puppet in the registry after subscribe twice')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after subscribe twice')
  t.equal(registry.get(puppet.id), puppet, 'should get puppet from the registry after subscribe twice')
  t.equal(puppetRef.get(puppet.id), 2, 'should get 1 puppet ref after subscribe twice')

  sub1.unsubscribe()
  t.equal(registry.size, 1, 'should be 1 puppet in the registry after unsubscribe once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after unsubscribe once')
  t.equal(registry.get(puppet.id), puppet, 'should get puppet from the registry after unsubscribe once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after unsubscribe once')

  sub2.unsubscribe()
  t.equal(registry.size, 0, 'should be 1 puppet in the registry after unsubscribe twice')
  t.equal(puppetRef.size, 0, 'should be 1 puppet in ref after unsubscribe twice')
})

test('registerPuppetInRegistry() with duck.actions.registerPuppet()', async t => {
  const spy    = sinon.spy()
  const puppet = new PuppetMock()
  const pool   = new Map()

  const $ = new Subject().pipe(
    registerPuppetInRegistry(pool)(puppet),
  )

  t.ok(spy.notCalled, 'should be a clean spy')

  const sub1 = $.subscribe(spy)
  t.ok(spy.calledOnce, 'should receive one action')
  t.same(spy.args[0]![0], duck.actions.REGISTER_PUPPET_COMMAND(puppet.id), 'should emit puppet register action after subscribe once')

  const sub2 = $.subscribe(spy)
  t.ok(spy.calledOnce, 'should receive no more actions after the 2+ subscription')

  sub1.unsubscribe()
  sub2.unsubscribe()
  t.ok(spy.calledOnce, 'should receive no more actions after unsubscribe')

  $.subscribe(spy)
  t.ok(spy.calledTwice, 'should receive another actions after re-subscribe from the fresh')
})

test('registerPuppetInRegistry() with store & wechaty', async t => {
  const spy = sinon.spy()

  const puppet = new PuppetMock()
  const pool   = new Map()

  const wechaty = WechatyBuilder.build({ puppet })

  const store = {
    dispatch: spy,
  } as any as Store

  const $ = new Subject().pipe(
    registerPuppetInRegistry(pool)(puppet, {
      store,
      wechaty,
    }),
  )

  t.ok(spy.notCalled, 'should be a clean storeSpy')

  const sub1 = $.subscribe(store.dispatch as any)
  t.ok(spy.calledTwice, 'should receive two action')
  t.same(spy.args[0]![0], duck.actions.REGISTER_PUPPET_COMMAND(puppet.id), 'should emit puppet register action after subscribe once')
  t.same(spy.args[1]![0], duck.actions.BIND_WECHATY_PUPPET_COMMAND({ puppetId: puppet.id, wechatyId: wechaty.id }), 'should emit bind wechaty puppet action after subscribe once')

  spy.resetHistory()
  spy.resetHistory()

  const sub2 = $.subscribe(spy)
  t.ok(spy.notCalled, 'should receive no more actions after the 2+ subscription')

  sub1.unsubscribe()
  t.ok(spy.notCalled, 'should receive no more actions after 1 unsubscribe')

  sub2.unsubscribe()
  t.equal(spy.callCount, 2, 'should receive two action after unsubscribe all')
  t.same(spy.args[0]![0], duck.actions.UNBIND_WECHATY_PUPPET_COMMAND({ puppetId: puppet.id, wechatyId: wechaty.id }), 'should emit unbind wechaty puppet action after unsubscribed all')
  t.same(spy.args[1]![0], duck.actions.DEREGISTER_PUPPET_COMMAND(puppet.id), 'should emit deregister puppet action after subscribe all')
})
