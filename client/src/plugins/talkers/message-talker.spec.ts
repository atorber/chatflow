#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import sinon from 'sinon'

import type {
  Message,
}               from 'wechaty'

import {
  messageTalker,
  MessageTalkerOptions,
}                             from './message-talker.js'

test('messageTalker()', async t => {
  const spy2 = sinon.spy()
  const spy3 = sinon.spy()
  const spy4 = sinon.spy()

  const EXPECTED_TEXT = 'text'

  const OPTIONS_TEXT: MessageTalkerOptions = EXPECTED_TEXT
  const OPTIONS_FUNCTION_LIST: MessageTalkerOptions = [ spy2, spy3 ]

  const mockMessage = {
    say: spy4,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Message

  let talkMessage = messageTalker(OPTIONS_TEXT)
  spy4.resetHistory()
  await talkMessage(mockMessage)
  t.ok(spy4.called, 'should called the contact.say')
  t.equal(spy4.args[0]![0], EXPECTED_TEXT, 'should say the expected text')

  talkMessage = messageTalker(OPTIONS_FUNCTION_LIST)
  spy2.resetHistory()
  spy3.resetHistory()
  await talkMessage(mockMessage)
  t.ok(spy2.called, 'should called the functions 1')
  t.equal(spy2.args[0]![0], mockMessage, 'should called the functions 1/1 with mockMessage')

  t.ok(spy3.called, 'should called the functions 2')
  t.equal(spy3.args[0]![0], mockMessage, 'should called the functions 2/1 with contact')
})

test('messageTalker() with mustache', async t => {
  const EXPECTED_TEXT = 'Hello, world!'
  const OPTIONS_TEXT: MessageTalkerOptions = 'Hello, {{ name }}!'
  const VAR = 'world'

  const spy = sinon.spy()
  const mockMessage = {
    say: spy,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Message

  const view = { name: VAR }

  const talkMessage = messageTalker<typeof view>(OPTIONS_TEXT)

  await talkMessage(mockMessage, view)
  t.ok(spy.called, 'should called the contact.say')
  t.equal(spy.args[0]![0], EXPECTED_TEXT, 'should say the expected text')
})
