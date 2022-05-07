#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import {
  wrapAsyncError,
}                             from './wrap-async-error.js'

test('wrapAsyncError() smoke testing', async t => {
  const spy = sinon.spy()

  const wrapAsync = wrapAsyncError(spy)

  const DATA = 'test'
  const promise = Promise.resolve(DATA)
  const wrappedPromise = wrapAsync(promise)
  t.equal(await wrappedPromise, undefined, 'should resolve Promise<any> to void')

  const rejection = Promise.reject(new Error('test'))
  const wrappedRejection = wrapAsync(rejection)
  t.equal(wrappedRejection, undefined, 'should be void and not to reject')

  t.equal(spy.callCount, 0, 'should have no error before sleep')
  await new Promise(resolve => setImmediate(resolve)) // wait async event loop task to be executed
  t.equal(spy.callCount, 1, 'should emit error when promise reject with error')
})

test('wrapAsyncError() with async function', async t => {
  const spy = sinon.spy()
  const wrapAsync = wrapAsyncError(spy)

  const ERROR = new Error('test error')

  t.doesNotThrow(() => wrapAsync(async () => 42)(), 'should not throw when wrap async function')
  t.equal(spy.callCount, 0, 'should not emit error when wrap async function with no exception')

  t.doesNotThrow(() => wrapAsync(async () => { throw ERROR })(), 'should not throw when wrap async function with exception')
  await new Promise(resolve => setImmediate(resolve)) // wait async event loop task to be executed
  t.equal(spy.callCount, 1, 'should emit error when wrap async function with exception')
  t.equal(spy.args[0]![0], ERROR, 'should emit error when wrap async function with exception')
})

test('wrapAsyncError() with a Promise value', async t => {
  const spy = sinon.spy()
  const wrapAsync = wrapAsyncError(spy)

  const ERROR = new Error('test error')

  t.doesNotThrow(() => wrapAsync(Promise.resolve(42)), 'should not throw when wrap a resolved promise')
  t.equal(spy.callCount, 0, 'should not emit error when wrap resolved promise with no rejection')

  t.doesNotThrow(() => wrapAsync(Promise.reject(ERROR)), 'should not throw when wrap rejected promise')
  await new Promise(resolve => setImmediate(resolve)) // wait async event loop task to be executed
  t.equal(spy.callCount, 1, 'should emit error when wrap promise with rejection')
  t.equal(spy.args[0]![0], ERROR, 'should emit rejection error when wrap promise with rejection')
})
