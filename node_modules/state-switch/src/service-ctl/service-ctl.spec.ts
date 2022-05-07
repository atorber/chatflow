#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
  AssertEqual,
}               from 'tstest'
import { EventEmitter } from 'events'
import type TypedEventEmitter from 'typed-emitter'
import { log } from 'brolog'

import {
  ServiceCtl,
  serviceCtlMixin,
}                     from './service-ctl.js'

test('ServiceCtl smoke testing', async t => {
  const sandbox = sinon.createSandbox()

  const onStartSpy = sandbox.spy()
  const onStopSpy  = sandbox.spy()

  class ServiceCtlImpl extends ServiceCtl {

    async onStart () {
      onStartSpy()
    }

    async onStop () {
      onStopSpy()
    }

  }

  const ctl = new ServiceCtlImpl()

  await ctl.start()
  t.ok(onStartSpy.calledOnce, 'should call onStart()')
  t.ok(onStopSpy.notCalled, 'should not call onStop()')

  await ctl.stop()
  t.ok(onStopSpy.calledOnce, 'should call onStop()')

  await t.resolves(() => ctl.reset(), 'should not reject when calling reset() with an inactive service')

  await ctl.start()
  sandbox.resetHistory()
  await t.resolves(() => ctl.reset(), 'should be able to reset with an active service')
  t.ok(onStartSpy.calledOnce, 'should call onStart() via reset()')
  t.ok(onStopSpy.calledOnce, 'should call onStop() via reset()')
})

test('ServiceCtlMixin smoke testing', async t => {
  const sandbox = sinon.createSandbox()

  const childOnStartSpy = sandbox.spy()
  const childOnStopSpy  = sandbox.spy()

  const parentStartSpy = sandbox.spy()
  const parentStopSpy  = sandbox.spy()

  type TestListener = (data: string) => void

  const MyEventEmitter = EventEmitter as unknown as new () => TypedEventEmitter<{
    test: TestListener
  }>

  class MyServiceBase extends MyEventEmitter {

    start ()  { parentStartSpy() }
    stop ()   { parentStopSpy() }

  }

  const mixinBase = serviceCtlMixin('MixinTest', { log })(MyServiceBase)

  class ServiceCtlImpl extends mixinBase {

    async onStart () {
      childOnStartSpy()
      this.emit('test', 42)
    }

    async onStop () {
      childOnStopSpy()
      this.emit('test', 'on-stop')
    }

  }

  const ctl = new ServiceCtlImpl()

  ctl.on('test', data => {
    const typeTest: AssertEqual<typeof data, string> = true
    t.ok(typeTest, 'test event should emit string type payload')
  })

  await ctl.start()
  t.ok(childOnStartSpy.calledOnce, 'should call onStart()')
  t.ok(parentStartSpy.calledOnce, 'should call parent start()')
  t.ok(childOnStopSpy.notCalled, 'should not call onStop()')
  t.ok(parentStopSpy.notCalled, 'should not call parent stop()')

  await ctl.stop()
  t.ok(childOnStopSpy.calledOnce, 'should call onStop()')
  t.ok(parentStopSpy.calledOnce, 'should call parent stop()')

  await t.resolves(() => ctl.reset(), 'should not reject when calling reset() with an inactive service')

  await ctl.start()
  sandbox.resetHistory()
  await t.resolves(() => ctl.reset(), 'should be able to reset with an active service')
  t.ok(childOnStartSpy.calledOnce, 'should call onStart() via reset()')
  t.ok(childOnStopSpy.calledOnce, 'should call onStop() via reset()')
  t.ok(parentStartSpy.calledOnce, 'should call parent start() via reset()')
  t.ok(parentStopSpy.calledOnce, 'should call parent stop() via reset()')
})
