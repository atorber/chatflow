#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import { FileBox } from '../file-box.js'

import { UniformResourceNameRegistry } from './uniform-resource-name-registry.js'

test('UniformResourceNameRegistry class', async t => {
  const QRCODE = 'test qrcode'

  const urnRegistry = new UniformResourceNameRegistry()
  await urnRegistry.init()

  const fileBox = FileBox.fromQRCode(QRCODE)
  const stream = await fileBox.toStream()

  const uuid = await urnRegistry.save(stream)

  const stream2 = await urnRegistry.load(uuid)
  t.ok(stream2, 'should load stream')

  const fileBox2 = FileBox.fromStream(stream2!, 'test')
  const qrcode = await fileBox2.toQRCode()

  t.equal(qrcode, QRCODE, 'should get back the qrcode data')

  await t.resolves(() => urnRegistry.load(uuid), 'should not reject when load a UUID again')

  await urnRegistry.destroy()
})

test('expireMilliseconds: in time', async t => {
  const expireMilliseconds = 3
  const urnRegistry = new UniformResourceNameRegistry({
    expireMilliseconds,
  })
  await urnRegistry.init()

  const uuid = await urnRegistry.save(await FileBox.fromQRCode('qr').toStream())
  await new Promise(resolve => setTimeout(resolve, 1))
  await t.resolves(() => urnRegistry.load(uuid), `should not expire after 1ms (with ${expireMilliseconds}ms expire)`)

  await urnRegistry.destroy()
})

test('expireMilliseconds: time out', async t => {
  const sandbox = sinon.createSandbox({
    useFakeTimers: true,
  })

  const expireMilliseconds = 10 * 60 * 1000  // 10 minute
  const urnRegistry = new UniformResourceNameRegistry({
    expireMilliseconds,
  })
  await urnRegistry.init()

  /**
   * Time: 0
   */
  const uuid1 = await urnRegistry.save(await FileBox.fromQRCode('qr').toStream())
  await t.resolves(() => urnRegistry.load(uuid1), 'should load uuid1 successfully')

  /**
   * Time: 5
   */
  await sandbox.clock.tickAsync(5 * 60 * 1000)
  const uuid2 = await urnRegistry.save(await FileBox.fromQRCode('qr2').toStream())
  await t.resolves(() => urnRegistry.load(uuid1), 'should load uuid1 successfully after 5 minutes')
  await t.resolves(() => urnRegistry.load(uuid2), 'should load uuid2 successfully')

  /**
   * Time: 11
   */
  await sandbox.clock.tickAsync(6 * 60 * 1000)
  await t.rejects(() => urnRegistry.load(uuid1), 'should load uuid1 fail because it is expired')
  await t.resolves(() => urnRegistry.load(uuid2), 'should load uuid2 successfully 6 minutes after it has been saved')

  /**
   * Time 20
   */
  await sandbox.clock.tickAsync(9 * 60 * 1000)
  await t.rejects(() => urnRegistry.load(uuid2), 'should load uuid2 fail because it is expired')

  await urnRegistry.destroy()
  sandbox.restore()
})

test('URN FileBox helper smoke testing', async t => {
  const QRCODE = 'test qrcode'

  const urnRegistry = new UniformResourceNameRegistry()

  const UUIDFileBox = urnRegistry.getFileBox()

  const uuid = await UUIDFileBox
    .fromQRCode(QRCODE)
    .toUuid()

  const qrcode = await UUIDFileBox
    .fromUuid(uuid)
    .toQRCode()

  t.equal(qrcode, QRCODE, 'should get back the qrcode data')
  urnRegistry.destroy()
})
