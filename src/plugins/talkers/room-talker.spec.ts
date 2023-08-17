#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import sinon from 'sinon'

import type {
  Contact,
  Room,
}               from 'wechaty'

import {
  roomTalker,
  RoomTalkerOptions,
}                             from './room-talker.js'

test('roomTalker()', async t => {
  const spy2 = sinon.spy()
  const spy3 = sinon.spy()
  const spy4 = sinon.spy()

  const EXPECTED_TEXT = 'text'

  const OPTIONS_TEXT: RoomTalkerOptions = EXPECTED_TEXT
  const OPTIONS_FUNCTION_LIST: RoomTalkerOptions = [ spy2, spy3 ]

  const mockContact = {} as any as Contact
  const mockRoom = {
    say: spy4,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Room

  let talkRoom = roomTalker(OPTIONS_TEXT)
  spy4.resetHistory()
  await talkRoom(mockRoom, mockContact)
  t.ok(spy4.called, 'should called the contact.say')
  t.equal(spy4.args[0]![0], EXPECTED_TEXT, 'should say the expected text')
  t.equal(spy4.args[0]![1], mockContact, 'should pass contact to say')

  talkRoom = roomTalker(OPTIONS_FUNCTION_LIST)
  spy2.resetHistory()
  spy3.resetHistory()
  await talkRoom(mockRoom, mockContact)
  t.ok(spy2.called, 'should called the functions 1')
  t.equal(spy2.args[0]![0], mockRoom, 'should called the functions 1/1 with mockRoom')
  t.equal(spy2.args[0]![1], mockContact, 'should called the functions 1/2 with mockContact')

  t.ok(spy3.called, 'should called the functions 2')
  t.equal(spy3.args[0]![0], mockRoom, 'should called the functions 2/1 with contact')
  t.equal(spy3.args[0]![1], mockContact, 'should called the functions 2/2 with mockContact')
})

test('roomTalker() with mustache', async t => {
  const EXPECTED_TEXT = 'Hello, world!'
  const OPTIONS_TEXT: RoomTalkerOptions = 'Hello, {{ name }}!'
  const VAR = 'world'

  const spy = sinon.spy()
  const mockContact = {} as any as Contact
  const mockRoom = {
    say: spy,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Room

  const view = { name: VAR }

  const talkRoom = roomTalker<typeof view>(OPTIONS_TEXT)

  await talkRoom(mockRoom, mockContact, view)
  t.ok(spy.called, 'should called the contact.say')
  t.equal(spy.args[0]![0], EXPECTED_TEXT, 'should say the expected text')
  t.equal(spy.args[0]![1], mockContact, 'should say with mockContact')
})

test('roomTalker() with room list', async t => {
  const spy2 = sinon.spy()
  const spy3 = sinon.spy()
  const spy4 = sinon.spy()
  const spy5 = sinon.spy()

  const EXPECTED_TEXT = 'text'

  const OPTIONS_TEXT: RoomTalkerOptions = EXPECTED_TEXT
  const OPTIONS_FUNCTION_LIST: RoomTalkerOptions = [ spy2, spy3 ]

  const mockContact1 = {} as any as Contact
  const mockContact2 = {} as any as Contact

  const mockRoom1 = {
    say: spy4,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Room

  const mockRoom2 = {
    say: spy5,
    wechaty: {
      sleep: () => undefined,
    },
  } as any as Room

  let talkRoom = roomTalker(OPTIONS_TEXT)
  spy4.resetHistory()
  await talkRoom([ mockRoom1, mockRoom2 ], [ mockContact1, mockContact2 ])
  t.ok(spy4.calledOnce, 'should called the room1.say once')
  t.equal(spy4.args[0]![0], EXPECTED_TEXT, 'should say the expected text')
  t.equal(spy4.args[0]![1], mockContact1, 'should pass contact1 to say')
  t.equal(spy4.args[0]![2], mockContact2, 'should pass contact2 to say')
  t.ok(spy5.calledOnce, 'should called the room2.say once')
  t.equal(spy5.args[0]![0], EXPECTED_TEXT, 'should say the expected text')
  t.equal(spy5.args[0]![1], mockContact1, 'should pass contact1 to say')
  t.equal(spy5.args[0]![2], mockContact2, 'should pass contact2 to say')

  talkRoom = roomTalker(OPTIONS_FUNCTION_LIST)
  spy2.resetHistory()
  spy3.resetHistory()
  await talkRoom([ mockRoom1, mockRoom2 ], [ mockContact1, mockContact2 ])
  t.ok(spy2.called, 'should called the functions 1')
  t.equal(spy2.args[0]![0], mockRoom1, 'should called the functions 1/1 with mockRoom1')
  t.equal(spy2.args[0]![1], mockContact1, 'should called the functions 1/2 with mockContact1')
  t.equal(spy2.args[0]![2], mockContact2, 'should called the functions 1/3 with mockContact2')
  t.equal(spy2.args[1]![0], mockRoom2, 'should called the functions 1/1 with mockRoom2')
  t.equal(spy2.args[1]![1], mockContact1, 'should called the functions 1/2 with mockContact1')
  t.equal(spy2.args[1]![2], mockContact2, 'should called the functions 1/3 with mockContact2')

  t.ok(spy3.called, 'should called the functions 2')
  t.equal(spy3.args[0]![0], mockRoom1, 'should called the functions 2/1 with mockRoom1')
  t.equal(spy3.args[0]![1], mockContact1, 'should called the functions 2/2 with mockContact1')
  t.equal(spy3.args[0]![2], mockContact2, 'should called the functions 2/3 with mockContact2')
  t.equal(spy3.args[1]![0], mockRoom2, 'should called the functions 2/1 with mockRoom2')
  t.equal(spy3.args[1]![1], mockContact1, 'should called the functions 2/2 with mockContact1')
  t.equal(spy3.args[1]![2], mockContact2, 'should called the functions 2/3 with mockContact2')
})
