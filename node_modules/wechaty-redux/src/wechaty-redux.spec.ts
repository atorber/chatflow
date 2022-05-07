#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  test,
  sinon,
}             from 'tstest'

import {
  WechatyBuilder,
  Message,
}                   from 'wechaty'
import * as PUPPET  from 'wechaty-puppet'

import {
  createStore,
  compose,
}                               from 'redux'
import { composeWithDevTools }  from 'remote-redux-devtools'
import {
  Ducks,
  noopReducer,
}                               from 'ducks'

import {
  mock,
  PuppetMock,
}                 from 'wechaty-puppet-mock'

import {
  getPuppet,
  getWechaty,
}                 from './registry/mod.js'
import * as duck  from './duck/mod.js'

import {
  WechatyRedux,
}                 from './wechaty-redux.js'

async function * wechatyFixtures () {
  const ducks = new Ducks({
    wechaty : duck,
  })

  let devCompose = compose

  if (process.env['REDUX_DEVTOOLS']) {
    devCompose = composeWithDevTools({
      hostname : 'localhost',
      port     : 8000,
      realtime : true,
      stopOn   : duck.types.NOP_COMMAND,
    }) as any
  }

  const ducksEnhancer = ducks.enhancer()

  const store = createStore(
    noopReducer,
    devCompose(
      ducksEnhancer,
    ) as typeof ducksEnhancer,
  )

  const mocker = new mock.Mocker()
  const puppet = new PuppetMock({ mocker })
  const bot = WechatyBuilder.build({ puppet })

  await bot.init()

  const bundle = ducks.ducksify('wechaty')

  bot.use(WechatyRedux({ store }))

  // store.subscribe(() => console.info(store.getState()))

  await bot.start()

  yield {
    bot,
    bundle,
    ducks,
    mocker,
    store,
  }

  // Stop the Redux Remote DevTools Server Connection
  bundle.operations.nop()

  await bot.stop()
}

test('WechatyRedux: selectors.{isLoggedIn,getQrCode,getUserPayload}()', async t => {
  for await (const {
    bot,
    mocker,
    bundle,
  } of wechatyFixtures()) {

    t.equal(bundle.selectors.isLoggedIn(bot.puppet.id), false, 'should not logged in at start')
    t.notOk(bundle.selectors.getQrCode(bot.puppet.id), 'should no QR Code at start')
    t.notOk(bundle.selectors.getCurrentUser(bot.puppet.id), 'should no user payload at start')

    const QR_CODE = 'qrcode'
    mocker.scan(QR_CODE)
    t.equal(bundle.selectors.getQrCode(bot.puppet.id), QR_CODE, 'should get QR Code right')

    const user = mocker.createContact()
    mocker.login(user)

    // Let the bullets fly
    await new Promise(resolve => setImmediate(resolve))

    // t.ok(bundle.selectors.isLoggedIn(bot.puppet.id), 'should logged in after login(user)')
    // t.notOk(bundle.selectors.getQrCode(bot.puppet.id), 'should no QR Code after user login')
    // t.same(bundle.selectors.getCurrentUser(bot.puppet.id), { ...user.payload, puppetId: bot.puppet.id }, 'should login user with payload')

    await bot.logout()
    t.notOk(bundle.selectors.isLoggedIn(bot.puppet.id), 'should logged out after call bot.logout')
  }
})

// test('WechatyRedux: operations.ding()', async t => {
//   for await (const {
//     bot,
//     bundle: duck,
//   } of wechatyFixtures()) {

//     const DATA = 'test'

//     const sandbox = sinon.createSandbox()
//     const spy = sandbox.spy(bot.puppet, 'ding')

//     duck.operations.ding(bot.puppet.id, DATA)

//     // Let the bullets fly
//     await new Promise(setImmediate)

//     t.ok(spy.calledOnce, 'should call bot.ding()')
//     t.ok(spy.calledWith(DATA), 'should called with DATA')
//   }
// })

// test('WechatyRedux: operations.say()', async t => {
//   for await (const {
//     bot,
//     bundle: duck,
//     mocker,
//   } of wechatyFixtures()) {

//     const TEXT = 'Hello, world.'

//     const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
//     mocker.login(user)

//     const sandbox = sinon.createSandbox()
//     const spy = sandbox.spy(bot.puppet, 'messageSendText')

//     const EXPECTED_ARGS = [
//       mary.id,
//       TEXT,
//     ]
//     duck.operations.say(bot.puppet.id, mary.id, PUPPET.payloads.sayable.text(TEXT, []))

//     // Let the bullets fly
//     await new Promise(resolve => setImmediate(resolve))

//     t.ok(spy.calledOnce, 'should call bot.say()')
//     t.ok(spy.calledWith(...EXPECTED_ARGS), 'should call say() with expected args')
//   }
// })

test('WechatyRedux: Puppet `message` event', async t => {
  for await (const {
    bot,
    mocker,
  } of wechatyFixtures()) {

    const TEXT = 'Hello, world.'

    const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
    mocker.login(user)

    const future = new Promise<Message>(resolve => bot.once('message', resolve))

    mary.say(TEXT).to(user)

    const msg = await future

    const EXPECTED_PAYLOAD: PUPPET.payloads.Message = {
      id            : msg.id,
      listenerId    : user.id,
      mentionIdList : [],
      talkerId      : mary.id,
      text          : TEXT,
      timestamp     : msg.date().getTime(),
      type          : PUPPET.types.Message.Text,

    }

    // Huan(202006) Workaround for puppet payload mismatch
    delete (EXPECTED_PAYLOAD as any).mentionIdList

    t.same(msg.payload, EXPECTED_PAYLOAD, 'should receive message with expected payload')
  }
})

test('WechatyRedux: getPuppet() & getWechaty()', async t => {
  const puppet = new PuppetMock()
  const wechaty = WechatyBuilder.build({ puppet })

  const spy = sinon.spy()
  const store = {
    dispatch: spy,
  }

  t.notOk(getWechaty(wechaty.id), 'should has no wechaty registered')
  t.notOk(getPuppet(puppet.id), 'should has no puppet registered')

  t.throws(() => wechaty.use(WechatyRedux({ store } as any)), 'should throws without init() puppet')

  await wechaty.init()
  wechaty.use(WechatyRedux({ store } as any))

  t.equal(getWechaty(wechaty.id), wechaty,  'should has wechaty registered after use plugin but before wechaty start')
  t.equal(getPuppet(puppet.id),   puppet,   'should has puppet registered after use plugin but before wechaty start')

  await wechaty.start()

  t.equal(getWechaty(wechaty.id), wechaty, 'should has wechaty registered after use plugin & wechaty start')
  t.equal(getPuppet(puppet.id), puppet, 'should has puppet registered after wechaty start')

  t.equal(spy.callCount, 6, 'should have 6 actions from wechaty start()')
  t.same(spy.args[0]![0], duck.actions.REGISTER_WECHATY_COMMAND(wechaty.id), 'should emit register wechaty action')
  t.same(spy.args[1]![0], duck.actions.REGISTER_PUPPET_COMMAND(puppet.id), 'should emit register puppet action')
  t.same(spy.args[2]![0], duck.actions.BIND_WECHATY_PUPPET_COMMAND({ puppetId: puppet.id, wechatyId: wechaty.id }), 'should emit bind wechaty puppet action')
  t.same(spy.args[3]![0], duck.actions.STATE_ACTIVATED_EVENT(puppet.id, 'pending'), 'should emit state active action')
  t.same(spy.args[4]![0], duck.actions.STATE_ACTIVATED_EVENT(puppet.id, true), 'should emit state inactive action')
  t.same(spy.args[5]![0], duck.actions.STARTED_EVENT(puppet.id), 'should emit start event action')

  spy.resetHistory()
  await wechaty.stop()

  t.equal(spy.callCount, 3, 'should have 3 actions from wechaty stop()')
  t.same(spy.args[0]![0], duck.actions.STATE_INACTIVATED_EVENT(puppet.id, 'pending'), 'should emit state inactive action')
  t.same(spy.args[1]![0], duck.actions.STATE_INACTIVATED_EVENT(puppet.id, true), 'should emit state ininactive action')
  t.same(spy.args[2]![0], duck.actions.STOPPED_EVENT(puppet.id), 'should emit stop event action')
})
