#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import {
  Watchdog,
  WatchdogFood,
}               from './watchdog.js'

// const sinonTest   = require('sinon-test')(sinon)

test('starve to reset', async t => {
  const sandbox = sinon.createSandbox({
    useFakeTimers : true,
  })

  const TIMEOUT = 1 * 1000
  const EXPECTED_FOOD = {
    data    : 'dummy',
    timeoutMilliseconds : TIMEOUT,
  } as WatchdogFood

  const watchdog = new Watchdog(TIMEOUT, 'TestWatchdog')

  watchdog.on('reset', (food, timeout) => {
    t.equal(timeout, TIMEOUT, 'timeout should equal to TIMEOUT when reset')
    t.same(food, EXPECTED_FOOD, 'should get food back when reset')
  })
  watchdog.feed(EXPECTED_FOOD)

  sandbox.clock.tick(TIMEOUT + 1)

  sandbox.restore()
})

test('feed in the middle', async t => {
  const sandbox = sinon.createSandbox({
    useFakeTimers : true,
  })

  // console.log('this', this)
  const TIMEOUT   = 1 * 1000
  const FEED_TIME = 0.3 * 1000

  const watchdog = new Watchdog(TIMEOUT, 'TestWatchdog')
  watchdog.on('reset', () => {
    t.fail('should not be reset')
  })
  watchdog.feed({ data: 'dummy' })

  sandbox.clock.tick(FEED_TIME)
  const left = watchdog.feed({ data: 'dummy' })
  t.equal(left, TIMEOUT - FEED_TIME, 'should get the time left dependes on the FEED_TIME')

  sandbox.restore()
})

test('sleep()', async t => {
  const sandbox = sinon.createSandbox({
    useFakeTimers : true,
  })

  const TIMEOUT   = 1 * 1000
  const FEED_TIME = 0.3 * 1000

  const watchdog = new Watchdog(TIMEOUT, 'TestWatchdog')
  watchdog.on('reset', () => {
    t.fail('should not be reset')
  })
  watchdog.feed({ data: 'dummy' })

  sandbox.clock.tick(FEED_TIME)
  watchdog.sleep()

  sandbox.clock.tick(TIMEOUT * 2)

  const left = watchdog.left()
  t.ok(left < 0, 'time should already passed by...')

  sandbox.restore()
})

test('event:feed', async t => {
  const watchdog = new Watchdog()
  const spy = sinon.spy()

  watchdog.on('feed', spy)
  watchdog.feed({ data: 'dummy' })
  watchdog.sleep()

  t.ok(spy.calledOnce, 'should fire event:feed')
})

test('event:sleep', async t => {
  const watchdog = new Watchdog()
  const spy = sinon.spy()

  watchdog.on('sleep', spy)
  watchdog.sleep()

  t.ok(spy.calledOnce, 'should fire event:sleep')
})

test('version()', async t => {
  const dog = new Watchdog()
  t.ok(dog.version(), 'should get version')
})
