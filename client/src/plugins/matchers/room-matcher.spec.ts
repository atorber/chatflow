#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import type { Room } from 'wechaty'

import { roomMatcher } from './room-matcher.js'

test('roomMatcher() smoke testing', async t => {
  const matcher = roomMatcher(/test/i)
  t.equal(typeof matcher, 'function', 'should return a match function')
})

test('roomMatcher() with string option', async t => {
  const TEXT_OK     = 'hello'
  const TEXT_NOT_OK = 'world'

  const topicOk    = () => TEXT_OK
  const topicNotOk = () => TEXT_NOT_OK

  const roomIdOk = {
    id: TEXT_OK,
    topic: topicNotOk,
  } as any as Room

  const roomTopicOk = {
    id: TEXT_NOT_OK,
    topic: topicOk,
  } as any as Room

  const roomNotOk = {
    id: TEXT_NOT_OK,
    topic: topicNotOk,
  } as any as Room

  const falseMatcher = roomMatcher()
  t.notOk(await falseMatcher(roomIdOk), 'should not match any room without options')
  t.notOk(await falseMatcher(roomTopicOk), 'should not match any room without options')

  const idMatcher = roomMatcher(TEXT_OK)

  t.notOk(await idMatcher(roomNotOk), 'should not match unexpected room by id')

  t.ok(await idMatcher(roomIdOk), 'should match expected room by id')
  t.notOk(await idMatcher(roomTopicOk), 'should not match room by topic')

  const idListMatcher = roomMatcher([ TEXT_OK ])

  t.notOk(await idListMatcher(roomNotOk), 'should not match unexpected room by id list')

  t.ok(await idListMatcher(roomIdOk), 'should match expected room by id list')
  t.notOk(await idListMatcher(roomTopicOk), 'should not match room by topic list')

  const regexpMatcher = roomMatcher(new RegExp(TEXT_OK))

  t.notOk(await regexpMatcher(roomNotOk), 'should not match unexpected room by regexp')

  t.notOk(await regexpMatcher(roomIdOk), 'should match room id by regexp')
  t.ok(await regexpMatcher(roomTopicOk), 'should match expected room topic by regexp')

  const regexpListMatcher = roomMatcher([ new RegExp(TEXT_OK) ])

  t.notOk(await regexpListMatcher(roomNotOk), 'should not match unexpected room by regexp list')

  t.notOk(await regexpListMatcher(roomIdOk), 'should not match room id by regexp list')
  t.ok(await regexpListMatcher(roomTopicOk), 'should match expected room topic by regexp list')

  const roomFilter = (room: Room) => [
    room.id,
    room.topic(),
  ].includes(TEXT_OK)

  const functionMatcher = roomMatcher(roomFilter)

  t.notOk(await functionMatcher(roomNotOk), 'should not match unexpected room by function')

  t.ok(await functionMatcher(roomTopicOk), 'should match expected topic by function')
  t.ok(await functionMatcher(roomIdOk), 'should match expected id by function')

  const functionListMatcher = roomMatcher([ roomFilter ])

  t.notOk(await functionListMatcher(roomNotOk), 'should not match unexpected room by function list')

  t.ok(await functionListMatcher(roomTopicOk), 'should match expected topic by function list')
  t.ok(await functionListMatcher(roomIdOk), 'should match expected text by function list')
})

test('roomMatcher with ReGexp[] options', async t => {
  const TEXT_OK_1     = 'text_ok_1'
  const TEXT_OK_2     = 'text_ok_2'
  const TEXT_NOT_OK = 'text_not_ok'

  const topicOk1    = () => TEXT_OK_1
  const topicOk2    = () => TEXT_OK_2
  const topicNotOk = () => TEXT_NOT_OK

  const roomIdOk1 = {
    id: TEXT_OK_1,
    topic: topicNotOk,
  } as any as Room

  const roomIdOk2 = {
    id: TEXT_OK_2,
    topic: topicNotOk,
  } as any as Room

  const roomTopicOk1 = {
    id: TEXT_NOT_OK,
    topic: topicOk1,
  } as any as Room

  const roomTopicOk2 = {
    id: TEXT_NOT_OK,
    topic: topicOk2,
  } as any as Room

  const roomNotOk = {
    id: TEXT_NOT_OK,
    topic: topicNotOk,
  } as any as Room

  const regexpMatcher = roomMatcher([
    new RegExp(TEXT_OK_1),
    new RegExp(TEXT_OK_2),
  ])

  t.notOk(await regexpMatcher(roomNotOk), 'should not match unexpected room by regexp list')

  t.notOk(await regexpMatcher(roomIdOk1), 'should match room id by regexp list 1')
  t.notOk(await regexpMatcher(roomIdOk2), 'should match room id by regexp list 2')
  t.ok(await regexpMatcher(roomTopicOk1), 'should match expected room topic by regexp list 1')
  t.ok(await regexpMatcher(roomTopicOk2), 'should match expected room topic by regexp list 2')
})
