#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint no-console: off */
/* eslint comma-spacing: off */
import {
  test,
  sinon,
}             from 'tstest'

import {
  Brolog,
  VERSION,
  Loggable,
}             from './brolog.js'

test('VERSION', t => {
  t.ok(/^\d+\.\d+\.\d+$/.test(VERSION), 'should get semver VERSION')
  t.end()
})

test('Brolog static/instance construct test', async t => {

  const EXPECTED_LEVEL = 'silly'

  const log = Brolog.instance('info')

  /**
   *
   * Raw
   *
   */
  let l = Brolog.level()
  t.equal(l, 'info', 'should has default level `info`')

  l = Brolog.level(EXPECTED_LEVEL)
  t.equal(l, EXPECTED_LEVEL, 'should be EXPECTED_LEVEL after setlevel to it')

  /**
   *
   * Instance
   *
   */
  const logInstance = Brolog.instance(EXPECTED_LEVEL)
  t.equal(typeof logInstance, 'object', 'should return a object class when we call Brolog as instance')
  t.equal(logInstance, log, 'should return a instance as default exported log')

  let ll = log.level()
  t.equal(ll, EXPECTED_LEVEL, 'should has current level as EXPECTED_LEVEL after factory & class init')

  /**
   *
   * Constructor
   *
   */
  const LEVEL_SILENT = 'silent'
  const log1 = new Brolog()
  log1.level(LEVEL_SILENT)
  ll = log1.level()
  t.equal(ll, LEVEL_SILENT, 'should has current level as LEVEL_SILENT after function init')
})

test('Brolog global log level test', async t => {
  const log = Brolog
  let l // level

  log.level('UN_EXIST_LEVEL' as any)
  t.equal(log.level(), 'silly', 'should set level to SILLY when level set to UNKNOWN')

  log.level('error')
  l = log.level()
  t.equal(l, 'error', 'should be ERR after level set to `error`')

  log.level('warn')
  l = log.level()
  t.equal(l, 'warn', 'should be warn after level set to `warn`')

  log.level('info')
  l = log.level()
  t.equal(l, 'info', 'should be info after level set to `info`')

  log.level('verbose')
  l = log.level()
  t.equal(l, 'verbose', 'should be verbose after level set to `verbose`')

  log.level('silly')
  l = log.level()
  t.equal(l, 'silly', 'should be silly after level set to silly')

})

/**
 *
 * This test must be the last one,
 * because monkey patch is not recover when it finish
 *
 */
test('Brolog global instance level filter test', async t => {
  const logFuncList = [
    'error',
    'warn',
    'info',
    'log',
  ] as const

  let log2: Brolog

  log2 = Brolog.instance('silent')

  await t.test('no error for silent', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLog(log2)
    t.ok((console.error as any)['notCalled'], 'should not call error with level SILENT ##############')
    sandbox.restore()
  })

  log2 = Brolog.instance('silly')
  await t.test('verbose + silly for silly', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLog(log2)
    t.equal((console.log as any)['callCount'], 2, 'should call log2(verbose + silly) 2 time with level SILLY')
    sandbox.restore()
  })

  log2 = Brolog.instance()
  log2.level('silent')
  await t.test('no log for silent', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLog(log2)
    t.equal((console.error as any)['callCount'] , 0, 'should call error 0 time with level SILENT')
    t.equal((console.warn as any)['callCount']  , 0, 'should call warn 0 time with level SILENT')
    t.equal((console.info as any)['callCount']  , 0, 'should call info 0 time with level SILENT')
    t.equal((console.log as any)['callCount']   , 0, 'should call log2(verbose + silly) 0 time with level SILENT')
    sandbox.restore()
  })

  log2.level('error')
  await t.test('only error for error', async t =>  {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLog(log2)
    t.equal((console.error as any)['callCount'] , 1, 'should call error 1 time with level ERR')
    t.equal((console.warn as any)['callCount']  , 0, 'should call warn 0 time with level ERR')
    t.equal((console.info as any)['callCount']  , 0, 'should call info 0 time with level ERR')
    t.equal((console.log as any)['callCount']   , 0, 'should call log2(verbose + silly) 0 time with level ERR')
    sandbox.restore()
  })

  log2.level('verbose')
  await t.test('for verbose', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLog(log2)
    t.equal((console.error as any)['callCount'] , 1, 'should call error 1 time with level VERBOSE')
    t.equal((console.warn as any)['callCount']  , 1, 'should call warn 1 time with level VERBOSE')
    t.equal((console.info as any)['callCount']  , 1, 'should call info 1 time with level VERBOSE')
    t.equal((console.log as any)['callCount']   , 1, 'should call log2(verbose + silly) 1 time with level VERBOSE')
    sandbox.restore()
  })

  /**  */

  function doLog (logger: any) {
    logger.error('Test', 'error message')
    logger.warn('Test', 'warn message')
    logger.info('Test', 'info message')
    logger.verbose('Test', 'verbose message')
    logger.silly('Test', 'silly message')
  }
})

test('Brolog global instance prefix filter test', async t => {
  const logFuncList = [
    'error',
    'warn',
    'info',
    'log',
  ] as const

  // filter log by prefix match /Show/
  const log = Brolog.instance('info', /Show/)

  await t.test('doLogHide /Show/', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLogHide(log)
    t.equal((console.error as any)['callCount'] , 0, 'should call error 0 time with prefix Hide')
    t.equal((console.warn as any)['callCount']  , 0, 'should call warn 0 time with prefix Hide')
    t.equal((console.info as any)['callCount']  , 0, 'should call info 0 time with prefix Hide')
    t.equal((console.log as any)['callCount']   , 0, 'should call log2(verbose + silly) 0 time with prefix Hide')
    sandbox.restore()
  })

  await t.test('doLogShow /Show/', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLogShow(log)
    t.equal((console.error as any)['callCount'] , 1, 'should call error 1 time with prefix Show')
    t.equal((console.warn as any)['callCount']  , 1, 'should call warn 1 time with prefix Show')
    t.equal((console.info as any)['callCount']  , 1, 'should call info 1 time with prefix Show')
    t.equal((console.log as any)['callCount']   , 0, 'should call log2(verbose + silly) 1 time with prefix Show')
    sandbox.restore()
  })

  log.level('silent')

  await t.test('doLogShow for silent', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLogShow(log)
    t.equal((console.error as any)['callCount'] , 0, 'should call error 0 time with prefix Show with level silent')
    t.equal((console.warn as any)['callCount']  , 0, 'should call warn 0 time with prefix Show with level silent')
    t.equal((console.info as any)['callCount']  , 0, 'should call info 0 time with prefix Show with level silent')
    t.equal((console.log as any)['callCount']   , 0, 'should call log2(verbose + silly) 0 time with prefix Show with level silent')
    sandbox.restore()
  })

  log.level('silly')

  await t.test('doLogShow for silly', async t => {
    const sandbox = sinon.createSandbox()
    logFuncList.forEach(logFunc => sandbox.stub(console, logFunc).callThrough())
    doLogShow(log)
    t.equal((console.error as any)['callCount'] , 1, 'should call error 1 time with prefix Show with level silly')
    t.equal((console.warn as any)['callCount']  , 1, 'should call warn 1 time with prefix Show with level silly')
    t.equal((console.info as any)['callCount']  , 1, 'should call info 1 time with prefix Show with level silly')
    t.equal((console.log as any)['callCount']   , 2, 'should call log2(verbose + silly) 2 time with prefix Show with level silly')
    sandbox.restore()
  })

  /**  */

  function doLogHide (logger: Loggable) {
    logger.error('Hide', 'error message')
    logger.warn('Hide', 'warn message')
    logger.info('Hide', 'info message')
    logger.verbose('Hide', 'verbose message')
    logger.silly('Hide', 'silly message')
  }

  function doLogShow (logger: Loggable) {
    logger.error('Show', 'error message')
    logger.warn('Show', 'warn message')
    logger.info('Show', 'info message')
    logger.verbose('Show', 'verbose message')
    logger.silly('Show', 'silly message')
  }
})

test('Brolog individual instance prefix filter test', async t => {
  // important: reset all to default: 'info', /.*/
  const log = Brolog.instance('info', /.*/)

  t.equal(log.level(), 'info', 'should be global level `info`')
  t.equal(log.prefix().toString(), '/.*/', 'should be global prefix filter /.*/')

  const log1 = new Brolog()
  const log2 = new Brolog()

  log2.level('silly')
  log2.prefix('faint')

  t.notEqual(log1, log, 'should not as the same as global instance')
  t.notEqual(log1, log2, 'should not as the same between new instances')

  t.equal(log1.level(), 'info', 'should stick with default level `info`')
  t.equal(log1.prefix().toString(), '/.*/', 'should stick with default prefix filter by default')

  t.equal(log2.level(), 'silly', 'should be set level `silly`')
  t.equal(log2.prefix().toString(), '/^faint$/', 'should be set prefix filter to /faint/')

  t.end()
})

test('Brolog enableLogger()', async t => {
  const sandbox = sinon.createSandbox()

  const spy  = sandbox.spy()
  const stub = sandbox.stub(Brolog.prototype, 'defaultTextPrinter')

  await t.test('enableLogging(false/true)', async t => {
    spy.resetHistory()
    stub.resetHistory()

    const log = Brolog.enableLogging(false)
    log.error('TEST', 'Should not log')

    t.ok(stub.notCalled, 'should not log anything after enableLogging(false)')

    log.enableLogging(true)
    stub.resetHistory()
    log.error('TEST', 'Should log')
    t.ok(stub.calledOnce, 'should log after enableLogging(true)')
  })

  await t.test('enableLogging(log function)', async t => {
    spy.resetHistory()
    stub.resetHistory()

    const log = Brolog.enableLogging(spy)
    log.error('TEST', 'should call spy')

    t.ok(stub.notCalled, 'should not call printTextDefault')
    t.ok(spy.calledOnce, 'should call spy after enableLogging(spy)')
  })

  // XXX why need t.end() inside async function(which will return a promise?)
  sandbox.restore()
})

test('Timestamp()', async t => {
  const log = new Brolog()
  t.ok(log.timestamp(), 'should enable timestamp by default')

  t.equal(log.timestamp(false), undefined, 'should return void when set timestamp to false')
  t.equal(log.timestamp(), '', 'should return empty string when timestamp is disabled')

  t.equal(log.timestamp(true), undefined, 'should return void when set timestamp to true')
  t.ok(log.timestamp(), 'should return timestamp string when timestamp is enabled')

})

test('version()', t => {
  const log = new Brolog()
  t.ok(log.version(), 'should get version')
  t.end()
})
