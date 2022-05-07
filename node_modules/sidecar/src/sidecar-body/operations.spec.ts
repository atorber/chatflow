#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  SidecarBody,
}                 from './sidecar-body.js'
import {
  init,
  attach,
  detach,
}                from './operations.js'
import { Sidecar } from '../decorators/mod.js'

import {
  INIT_SYMBOL,
  ATTACH_SYMBOL,
  DETACH_SYMBOL,
}                 from './constants.js'

const targetProgram = () =>
  process.platform        === 'linux'   ? '/bin/ls'
    : process.platform    === 'darwin'  ? '/bin/ls'
      : process.platform  === 'win32'   ? 'c:\\Windows\\notepad.exe'
        : 'targteProgram(): Unknown process.platform:' + process.platform

test('init()', async t => {

  @Sidecar([targetProgram()])
  class SidecarTest extends SidecarBody {}

  const s = new SidecarTest()
  const future = new Promise<void>(resolve => s.on(INIT_SYMBOL, resolve))

  try {
    await init(s)

    await Promise.race([
      future,
      new Promise((resolve, reject) => {
        void resolve
        setTimeout(reject, 100)
      }),
    ])

    t.pass('init() successfully')
  } catch (e) {
    t.fail('Rejection:' + e && (e as Error).message)
    console.error(e)
  }
})

test('attach()', async t => {

  @Sidecar([targetProgram()])
  class SidecarTest extends SidecarBody {}

  const sidecar = new SidecarTest()

  sidecar.script = {
    unload: (..._: any[]) => { return {} as any },
  } as any
  sidecar.session = {
    detach: (..._: any[]) => { return {} as any },
  } as any

  const future = new Promise<void>(resolve => sidecar.on(ATTACH_SYMBOL, resolve))

  try {
    await attach(sidecar)

    await Promise.race([
      future,
      new Promise((resolve, reject) => {
        void resolve
        setTimeout(reject, 100)
      }),
    ])
    t.pass('attach() successfully')
  } catch (e) {
    t.fail('Rejection:' + e && (e as Error).message)
  } finally {
    try {
      await detach(sidecar)
    } catch (e) {}
  }
})

test('detach()', async t => {

  @Sidecar([targetProgram()])
  class SidecarTest extends SidecarBody {}

  const sidecar = new SidecarTest()
  sidecar.on('error', () => {})

  const future = new Promise<void>(resolve => sidecar.on(DETACH_SYMBOL, resolve))

  try {
    await init(sidecar)
    await attach(sidecar)

    await detach(sidecar)

    await Promise.race([
      future,
      new Promise((resolve, reject) => {
        void resolve
        setTimeout(reject, 100)
      }),
    ])

    t.pass('detach() successfully')
  } catch (e) {
    t.fail('Rejection:' + e && (e as Error).message)
  }
})
