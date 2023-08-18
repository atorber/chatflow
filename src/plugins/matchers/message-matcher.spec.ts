#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import type { Message } from 'wechaty'
import { messageMatcher } from './message-matcher.js'

test('messageMatcher() smoke testing', async t => {
  const matcher = messageMatcher(/test/i)
  t.equal(typeof matcher, 'function', 'should return a match function')
})

test('messageMatcher() with string option', async t => {
  const TEXT_OK     = 'hello'
  const TEXT_NOT_OK = 'world'

  const textOk   = () => TEXT_OK
  const roomOk   = () => ({ id: TEXT_OK, topic: () => TEXT_OK })
  const talkerOk = () => ({ id: TEXT_OK, name: () => TEXT_OK })

  const textNotOk   = () => TEXT_NOT_OK
  const roomNotOk   = () => ({ id: TEXT_NOT_OK, topic: () => TEXT_NOT_OK })
  const talkerNotOk = () => ({ id: TEXT_NOT_OK, name: () => TEXT_NOT_OK })

  const messageFromOk = {
    id: TEXT_NOT_OK,
    mentionText: textNotOk,
    room: roomNotOk,
    talker: talkerOk,
    text: textNotOk,
  } as any as Message

  const messageTextOk = {
    id: TEXT_NOT_OK,
    mentionText: textOk,
    room: roomNotOk,
    talker: talkerNotOk,
    text: textOk,
  } as any as Message

  const messageTopicOk = {
    id: TEXT_NOT_OK,
    mentionText: textNotOk,
    room: roomOk,
    talker: talkerNotOk,
    text: textNotOk,
  } as any as Message

  const messageIdOk = {
    id: TEXT_OK,
    room: roomOk,
    talker: talkerNotOk,
    text: textNotOk,
  } as any as Message

  const messageNotOk = {
    id: TEXT_NOT_OK,
    mentionText: textNotOk,
    room: roomNotOk,
    talker: talkerNotOk,
    text: textNotOk,
  } as any as Message

  const falseMatcher = messageMatcher()
  t.notOk(await falseMatcher(messageFromOk), 'should not match any message: from')
  t.notOk(await falseMatcher(messageTopicOk), 'should not match any message: topic')
  t.notOk(await falseMatcher(messageIdOk), 'should not match any message: text')

  const idMatcher = messageMatcher(TEXT_OK)

  t.notOk(await idMatcher(messageNotOk), 'should not match unexpected message by id')

  t.ok(await idMatcher(messageFromOk), 'should match expected from by id')
  t.ok(await idMatcher(messageTopicOk), 'should match expected topic by id')
  t.ok(await idMatcher(messageIdOk), 'should match expected text by id')

  const idListMatcher = messageMatcher([ TEXT_OK ])

  t.notOk(await idListMatcher(messageNotOk), 'should not match unexpected message by id list')

  t.ok(await idListMatcher(messageFromOk), 'should match expected from by id list')
  t.ok(await idListMatcher(messageTopicOk), 'should match expected topic by id list')
  t.ok(await idListMatcher(messageIdOk), 'should match expected text by id list')

  const regexpMatcher = messageMatcher(new RegExp(TEXT_OK))

  t.notOk(await regexpMatcher(messageNotOk), 'should not match unexpected message by regexp')

  t.ok(await regexpMatcher(messageFromOk), 'should match expected from by regexp')
  t.ok(await regexpMatcher(messageTopicOk), 'should match expected topic by regexp')
  t.ok(await regexpMatcher(messageTextOk), 'should match expected text by regexp')

  const regexpListMatcher = messageMatcher([ new RegExp(TEXT_OK) ])

  t.notOk(await regexpListMatcher(messageNotOk), 'should not match unexpected message by regexp')

  t.ok(await regexpListMatcher(messageFromOk), 'should match expected from by regexp')
  t.ok(await regexpListMatcher(messageTopicOk), 'should match expected topic by regexp')
  t.ok(await regexpListMatcher(messageTextOk), 'should match expected text by regexp')

  const messageFilter = (message: Message) => [
    message.text(),
    message.room()?.topic(),
    message.talker().name(),
  ].includes(TEXT_OK)

  const functionMatcher = messageMatcher(messageFilter)

  t.notOk(await functionMatcher(messageNotOk), 'should not match unexpected message by function')

  t.ok(await functionMatcher(messageFromOk), 'should match expected from by function')
  t.ok(await functionMatcher(messageTopicOk), 'should match expected topic by function')
  t.ok(await functionMatcher(messageTextOk), 'should match expected text by function')

  const functionListMatcher = messageMatcher([ messageFilter ])

  t.notOk(await functionListMatcher(messageNotOk), 'should not match unexpected message by function list')

  t.ok(await functionListMatcher(messageFromOk), 'should match expected from by function list')
  t.ok(await functionListMatcher(messageTopicOk), 'should match expected topic by function list')
  t.ok(await functionListMatcher(messageTextOk), 'should match expected text by function list')

})
