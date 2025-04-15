#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'
import type { Contact } from 'wechaty'

import { contactMatcher } from './contact-matcher.js'

test('contactMatcher() smoke testing', async t => {
  const matcher = contactMatcher(/test/i)
  t.equal(typeof matcher, 'function', 'should return a match function')
})

test('contactMatcher() with string option', async t => {
  const TEXT_OK     = 'hello'
  const TEXT_NOT_OK = 'world'

  const nameOk    = () => TEXT_OK
  const nameNotOk = () => TEXT_NOT_OK

  const contactIdOk = {
    id: TEXT_OK,
    name: nameNotOk,
  } as any as Contact

  const contactNameOk = {
    id: TEXT_NOT_OK,
    name: nameOk,
  } as any as Contact

  const contactNotOk = {
    id: TEXT_NOT_OK,
    name: nameNotOk,
  } as any as Contact

  const falseMatcher = contactMatcher()
  t.notOk(await falseMatcher(contactIdOk), 'should not match any contact without options')
  t.notOk(await falseMatcher(contactNameOk), 'should not match any contact without options')

  const idMatcher = contactMatcher(TEXT_OK)

  t.notOk(await idMatcher(contactNotOk), 'should not match unexpected contact by id')

  t.ok(await idMatcher(contactIdOk), 'should match expected contact by id')
  t.notOk(await idMatcher(contactNameOk), 'should not match contact by name')

  const idListMatcher = contactMatcher([ TEXT_OK ])

  t.notOk(await idListMatcher(contactNotOk), 'should not match unexpected contact by id list')

  t.ok(await idListMatcher(contactIdOk), 'should match expected contact by id list')
  t.notOk(await idListMatcher(contactNameOk), 'should not match contact by name list')

  const regexpMatcher = contactMatcher(new RegExp(TEXT_OK))

  t.notOk(await regexpMatcher(contactNotOk), 'should not match unexpected contact by regexp')

  t.notOk(await regexpMatcher(contactIdOk), 'should match contact id by regexp')
  t.ok(await regexpMatcher(contactNameOk), 'should match expected contact name by regexp')

  const regexpListMatcher = contactMatcher([ new RegExp(TEXT_OK) ])

  t.notOk(await regexpListMatcher(contactNotOk), 'should not match unexpected contact by regexp list')

  t.notOk(await regexpListMatcher(contactIdOk), 'should not match contact id by regexp list')
  t.ok(await regexpListMatcher(contactNameOk), 'should match expected contact name by regexp list')

  const roomFilter = (room: Contact) => [
    room.id,
    room.name(),
  ].includes(TEXT_OK)

  const functionMatcher = contactMatcher(roomFilter)

  t.notOk(await functionMatcher(contactNotOk), 'should not match unexpected contact by function')

  t.ok(await functionMatcher(contactNameOk), 'should match expected name by function')
  t.ok(await functionMatcher(contactIdOk), 'should match expected id by function')

  const functionListMatcher = contactMatcher([ roomFilter ])

  t.notOk(await functionListMatcher(contactNotOk), 'should not match unexpected contact by function list')

  t.ok(await functionListMatcher(contactNameOk), 'should match expected name by function list')
  t.ok(await functionListMatcher(contactIdOk), 'should match expected text by function list')
})
