#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}           from 'tstest'

import {
  MemoryCard,
  NAMESPACE_KEY_SEPRATOR,
  NAMESPACE_MULTIPLEX_SEPRATOR,
}                                 from './memory-card.js'
// import { MemoryCardPayload }      from './types'

class MemoryCardTest extends MemoryCard {

  // public get payload () {
  //   return super.payload
  // }

  // public set payload (data: undefined | MemoryCardPayload) {
  //   super.payload = data
  // }

  override resolveKey (key: string): string {
    return super.resolveKey(key)
  }

  override multiplexPath (): string {
    return super.multiplexPath()
  }

  override isMultiplexKey (key: string): boolean {
    return super.isMultiplexKey(key)
  }

}

test('multiplex set() & get()', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCard({
    name: NAME,
  })
  await card.load()

  const cardA = card.multiplex('a')
  const cardB = card.multiplex('b')

  t.equal(await card.size,  0, 'init with 0 for card')
  t.equal(await cardA.size, 0, 'init with 0 for cardA')
  t.equal(await cardB.size, 0, 'init with 0 for cardB')

  await card.set(KEY, VAL)
  t.equal(await card.size,  1, 'size with 1')
  t.equal(await cardA.size, 0, 'size with 0 for cardA')
  t.equal(await cardB.size, 0, 'size with 0 for cardB')

  await cardA.set(KEY, VAL)
  t.equal(await card.size,  2, 'card size with 2(include cardA)')
  t.equal(await cardA.size, 1, 'cardA size with 1')
  t.equal(await cardB.size, 0, 'cardB size with 0')

  await cardB.set(KEY, VAL)
  t.equal(await card.size,  3, 'card size with 3(include cardA & cardB)')
  t.equal(await cardA.size, 1, 'cardA size with 1')
  t.equal(await cardB.size, 1, 'cardB size with 1')

  await cardB.delete('a')
  t.equal(await card.size,  2, 'card size with 2(include cardA)')
  t.equal(await cardA.size, 1, 'cardA size with 1')
  t.equal(await cardB.size, 0, 'cardB size with 0')

  await cardA.delete('a')
  t.equal(await card.size,  1, 'size with 1')
  t.equal(await cardA.size, 0, 'size with 0 for cardA')
  t.equal(await cardB.size, 0, 'size with 0 for cardB')

  await card.delete('a')
  t.equal(await card.size,  0, 'size with 0')
  t.equal(await cardA.size, 0, 'size with 0 for cardA')
  t.equal(await cardB.size, 0, 'size with 0 for cardB')

  await card.destroy()
})

test('multiplex clear()', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCard({ name: NAME })
  await card.load()

  const cardA = card.multiplex('a')
  const cardB = card.multiplex('b')

  await card.set(KEY, VAL)
  await cardA.set(KEY, VAL)
  await cardB.set(KEY, VAL)

  t.equal(await card.size,  3, 'card size with 3(include cardA & cardB)')
  t.equal(await cardA.size, 1, 'cardA size with 1')
  t.equal(await cardB.size, 1, 'cardB size with 1')

  await cardB.clear()
  t.equal(await card.size,  2, 'card size with 2(include cardA & cardB)')
  t.equal(await cardA.size, 1, 'cardA size with 1')
  t.equal(await cardB.size, 0, 'cardB size with 0')

  await cardA.clear()
  t.equal(await card.size,  1, 'card size with 1(include cardA & cardB)')
  t.equal(await cardA.size, 0, 'cardA size with 0')
  t.equal(await cardB.size, 0, 'cardB size with 0')

  await card.destroy()
})

test('multiplex deeper than two layers', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const NAME = Math.random().toString().substr(2)

  const card    = new MemoryCardTest({ name: NAME })
  await card.load()

  const cardA   = card.multiplex('a')
  const cardAA  = cardA.multiplex('a')
  const cardAAA = cardAA.multiplex('a')

  await card.set(KEY, VAL)
  await cardA.set(KEY, VAL)
  await cardAA.set(KEY, VAL)
  await cardAAA.set(KEY, VAL)

  // console.log(card.payload)

  t.equal(await card.size,  4, 'card size with 4(include cardA & cardAA & cardAAA)')
  t.equal(await cardA.size, 3, 'cardA size with 3')
  t.equal(await cardAA.size, 2, 'cardAA size with 2')
  t.equal(await cardAAA.size, 1, 'cardAAA size with 1')

  await cardAA.delete('a')
  t.equal(await card.size,  3, 'card size with 4(include cardA & cardAA & cardAAA)')
  t.equal(await cardA.size, 2, 'cardA size with 3')
  t.equal(await cardAA.size, 1, 'cardAA size with 1 (include cardAAA)')
  t.equal(await cardAAA.size, 1, 'cardAAA size with 1')

  await card.destroy()
})

test('multiplex destroy()', async t => {
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCard({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  try {
    await cardA.destroy()
    t.fail('should throw')
  } catch (e) {
    t.pass('should not allow destroy() on multiplexed memory')
  }
})

test('multiplex clear()', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCard({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  await card.set(KEY, VAL)
  await cardA.set(KEY, VAL)

  await cardA.clear()

  t.equal(await card.size, 1, 'should keep parent data when clear child(multiplex)')
  t.equal(await cardA.size, 0, 'should clear the memory')
})

test('multiplex has()', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const KEYA = 'aa'
  const VALA = 'bb'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCard({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  await card.set(KEY, VAL)
  await cardA.set(KEYA, VALA)

  t.ok(await card.has(KEY), 'card should has KEY')
  t.notOk(await card.has(KEYA), 'card should not has KEYA')

  t.ok(await cardA.has(KEYA), 'cardA should has KEYA')
  t.notOk(await cardA.has(KEY), 'cardA should not has KEY')

  await card.destroy()
})

test('multiplex keys()', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const KEYA = 'aa'
  const VALA = 'bb'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCardTest({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  await card.set(KEY, VAL)
  await cardA.set(KEYA, VALA)

  const cardKeys = []
  const cardAKeys = []

  for await (const key of card.keys()) {
    cardKeys.push(key)
  }
  for await (const key of cardA.keys()) {
    cardAKeys.push(key)
  }

  t.deepEqual(cardKeys, [KEY, cardA.resolveKey(KEYA)], 'should get keys back for card')
  t.deepEqual(cardAKeys, [KEYA], 'should get keys back for cardA')
})

test('multiplex values()', async t => {
  const KEY = 'key'
  const VAL = 'val'
  const KEYA = 'key-a'
  const VALA = 'val-a'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCard({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  await card.set(KEY, VAL)
  await cardA.set(KEYA, VALA)

  const cardValues = []
  const cardAValues = []

  for await (const value of card.values()) {
    cardValues.push(value)
  }
  for await (const value of cardA.values()) {
    cardAValues.push(value)
  }

  t.deepEqual(cardValues, [VAL, VALA], 'should get values back for card')
  t.deepEqual(cardAValues, [VALA], 'should get values back for cardA')
})

test('multiplex entries()', async t => {
  const KEY = 'key'
  const VAL = 'val'
  const KEYA = 'key-a'
  const VALA = 'val-a'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCardTest({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  await card.set(KEY, VAL)
  await cardA.set(KEYA, VALA)

  const cardKeys    = []
  const cardAKeys   = []
  const cardValues  = []
  const cardAValues = []

  for await (const [key, value] of card.entries()) {
    cardKeys.push(key)
    cardValues.push(value)
  }
  t.deepEqual(cardKeys, [KEY, cardA.resolveKey(KEYA)], 'should get keys back for card')
  t.deepEqual(cardValues, [VAL, VALA], 'should get values back for card')

  for await (const [key, value] of cardA.entries()) {
    cardAKeys.push(key)
    cardAValues.push(value)
  }
  // console.log(cardA.payload)
  t.deepEqual(cardAKeys, [KEYA], 'should get keys back for cardA')
  t.deepEqual(cardAValues, [VALA], 'should get values back for cardA')
})

test('multiplex [Symbol.asyncIterator]()', async t => {
  const KEY = 'a'
  const VAL = 'b'
  const KEYA = 'aa'
  const VALA = 'bb'
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCardTest({ name: NAME })
  await card.load()

  const cardA = card.multiplex('test')

  await card.set(KEY, VAL)
  await cardA.set(KEYA, VALA)

  const cardKeys    = []
  const cardAKeys   = []
  const cardValues  = []
  const cardAValues = []

  for await (const [key, value] of card) {
    cardKeys.push(key)
    cardValues.push(value)
  }
  t.deepEqual(cardKeys, [KEY, cardA.resolveKey(KEYA)], 'should get keys back for card')
  t.deepEqual(cardValues, [VAL, VALA], 'should get values back for card')

  for await (const [key, value] of cardA) {
    cardAKeys.push(key)
    cardAValues.push(value)
  }
  t.deepEqual(cardAKeys, [KEYA], 'should get keys back for cardA')
  t.deepEqual(cardAValues, [VALA], 'should get values back for cardA')
})

test('multiplex toString()', async t => {
  const NAME = Math.random().toString().substr(2)
  const MULTIPLEX_NAME = 'sub'

  const cardNoName = new MemoryCard({ name: 'test' })
  await cardNoName.load()

  const cardNoNameA = cardNoName.multiplex(MULTIPLEX_NAME)

  const card = new MemoryCard({ name: NAME })
  const cardA = card.multiplex(MULTIPLEX_NAME)

  t.equal(cardNoName.toString(), 'MemoryCard<test>', 'should get toString with empty name')
  t.equal(cardNoNameA.toString(), `MemoryCard<test>.multiplex(${MULTIPLEX_NAME})`,
    'should get toString with empty name . multiplex(xxx)',
  )

  t.equal(card.toString(), `MemoryCard<${NAME}>`, 'should get toString with name')
  t.equal(cardA.toString(), `MemoryCard<${NAME}>.multiplex(${MULTIPLEX_NAME})`,
    'should get toString with name & sub name',
  )
})

test('multiplex multiplexKey()', async t => {
  const SUB_NAME = 'sub-name'
  const SUB_KEY  = 'sub-key'
  const NAME = Math.random().toString().substr(2)

  const EXPECTED_ABS_KEY = [
    NAMESPACE_MULTIPLEX_SEPRATOR,
    SUB_NAME,
    NAMESPACE_KEY_SEPRATOR,
    SUB_KEY,
  ].join('')

  const card = new MemoryCardTest({ name: NAME })
  await card.load()

  const cardA = card.multiplex(SUB_NAME)

  t.equal(card.resolveKey(SUB_KEY), SUB_KEY, 'root memory should get the same subKey for their arg')
  t.equal(cardA.resolveKey(SUB_KEY), EXPECTED_ABS_KEY, 'should get subKey for NAME')

  await card.destroy()
})

test('multiplex isMultiplex()', async t => {
  const NAME = Math.random().toString().substr(2)

  const card = new MemoryCardTest({ name: NAME })
  await card.load()

  const cardA = card.multiplex(NAME)

  t.equal(card.isMultiplex(), false, 'card is not a sub memory')
  t.equal(cardA.isMultiplex(), true, 'card a is a sub memory')
})

test('multiplex isMultiplexKey()', async t => {
  const NAME = Math.random().toString().substr(2)
  const KEY  = Math.random().toString().substr(2)

  const EXPECTED_MULTIPLEX_KEY = [
    NAMESPACE_MULTIPLEX_SEPRATOR,
    NAME,
    NAMESPACE_KEY_SEPRATOR,
    KEY,
  ].join('')

  const card = new MemoryCardTest({ name: NAME })
  const cardA = card.multiplex(NAME)

  t.equal(card.isMultiplexKey(KEY),                     false,  'card should identify normal string as not sub key')
  t.equal(cardA.isMultiplexKey(EXPECTED_MULTIPLEX_KEY), true,   'card a should identify SUB_KEY a sub key')
})

test('multiplex save()', async t => {
  const MEMORY_NAME = Math.random().toString().substr(2)
  const SUB_NAME    = Math.random().toString().substr(2)

  const card  = new MemoryCardTest({ name: MEMORY_NAME })
  await card.load()

  const cardA = card.multiplex(SUB_NAME)

  const sandbox = sinon.createSandbox()

  const stub = sandbox.stub(card, 'save').callsFake(async () => { /* void */ })

  await cardA.save()
  t.equal(stub.callCount, 1, 'multiplexed memory should call parent save()')

  await card.destroy()
  sandbox.restore()
})

test('multiplex multiplexPath()', async t => {
  const SUB_NAME_A = Math.random().toString().substr(2)
  const SUB_NAME_B = Math.random().toString().substr(2)

  const EXPECTED_SUB_PATH = [SUB_NAME_A, SUB_NAME_B].join('/')

  const card = new MemoryCardTest({ name: 'test' })
  const cardA = card.multiplex(SUB_NAME_A)
  const cardB = cardA.multiplex(SUB_NAME_B)

  t.equal(cardB.multiplexPath(), EXPECTED_SUB_PATH, 'should get sub path right')
})
