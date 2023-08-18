#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import type { Contact } from 'wechaty'

import {
  contactTalker,
  ContactTalkerOptions,
}                             from './contact-talker.js'

test('contactTalker()', async t => {
  const spy1 = sinon.spy()
  const spy2 = sinon.spy()
  const spy3 = sinon.spy()
  const spy4 = sinon.spy()

  const EXPECTED_TEXT = 'text'

  const OPTIONS_TEXT: ContactTalkerOptions = EXPECTED_TEXT
  const OPTIONS_FUNCTION: ContactTalkerOptions = spy1
  const OPTIONS_FUNCTION_LIST: ContactTalkerOptions = [ spy2, spy3 ]

  const mockContact = {
    say: spy4,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Contact

  await contactTalker(OPTIONS_TEXT)(mockContact)
  t.ok(spy4.called, 'should called the contact.say')
  t.equal(spy4.args[0]![0], EXPECTED_TEXT, 'should say the expected text')

  await contactTalker(OPTIONS_FUNCTION)(mockContact)
  t.ok(spy1.called, 'should called the function')
  t.equal(spy1.args[0]![0], mockContact, 'should called the function with contact')

  const talkContact = contactTalker(OPTIONS_FUNCTION_LIST)
  await talkContact(mockContact)
  t.ok(spy2.called, 'should called the functions 1')
  t.ok(spy3.called, 'should called the functions 2')
  t.equal(spy2.args[0]![0], mockContact, 'should called the functions 1 with contact')
  t.equal(spy3.args[0]![0], mockContact, 'should called the functions 2 with contact')
})

test('contactTalker() with mustache', async t => {
  const EXPECTED_TEXT = 'Hello, world!'
  const OPTIONS_TEXT: ContactTalkerOptions = 'Hello, {{ name }}!'
  const VAR = 'world'

  const spy = sinon.spy()
  const mockContact = {
    say: spy,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Contact

  const view = { name: VAR }

  const talkContact = contactTalker<typeof view>(OPTIONS_TEXT)

  await talkContact(mockContact, undefined, view)
  t.ok(spy.called, 'should called the contact.say')
  t.equal(spy.args[0]![0], EXPECTED_TEXT, 'should say the expected text')
})
