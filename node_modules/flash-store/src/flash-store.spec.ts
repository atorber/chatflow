#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import fs    from 'fs'
import os    from 'os'
import path  from 'path'

// import rimraf from 'rimraf'

import { test } from 'tstest'

// import { log }    from './config'
// log.level('silly')

import {
  FlashStore,
}               from './flash-store.js'

const KEY     = 'test-key'
const VAL     = 'test-val'
const VAL_OBJ = { obj_key: 'obj_val' }

test('constructor()', async t => {
  const tmpDir = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      'flash-store-',
    ),
  )

  await t.resolves(async () => {
    const store = new FlashStore(tmpDir)

    // need to do something to create the db directory
    await store.delete('init')

    t.ok(fs.existsSync(tmpDir), 'should create the workDir')
    await store.destroy()
  }, 'should not reject with a non existing workDir')

  t.ok(!fs.existsSync(tmpDir), 'should destroyed the workDir')
})

test('version()', async t => {
  for await (const store of storeFixture()) {
    t.ok(store.version().match(/^\d+\.\d+\.\d+$/), 'should get semver version')
  }
})

test('Store as async iterator', async t => {

  await t.test('async iterator for empty store', async t => {
    for await (const store of storeFixture()) {
      let n = 0
      for await (const _ of store) {
        n++
        // break
      }
      t.equal(n, 0, 'should get empty iterator')
    }
  })

  await t.test('async iterator', async t => {
    for await (const store of storeFixture()) {
      await store.set(KEY, VAL)
      let n = 0
      for await (const [key, val] of store) {
        t.equal(key, KEY, 'should get key back')
        t.equal(val, VAL, 'should get val back')
        n++
      }
      t.equal(n, 1, 'should iterate once')
    }
  })

})

test('async get()', async t => {
  await t.test('return null for non existing key', async t => {
    for await (const store of storeFixture()) {
      const val = await store.get(KEY)
      t.equal(val, undefined, 'should get undefined for not exist key')
    }
  })

  await t.test('store string key/val', async t => {
    for await (const store of storeFixture()) {
      await store.set(KEY, VAL)
      const val = await store.get(KEY)
      t.equal(val, VAL, 'should get VAL after set KEY')
    }
  })

  await t.test('store object value', async t => {
    for await (const store of storeFixture()) {
      await store.set(KEY, VAL_OBJ)
      const val = await store.get(KEY)
      t.same(val, VAL_OBJ, 'should get VAL_OBJ after set KEY')
    }
  })
})

test('async set()', async t => {
  for await (const store of storeFixture()) {
    await store.set(KEY, VAL)
    const val = await store.get(KEY)
    t.equal(val, VAL, 'should set VAL for KEY')
  }
})

test('async size()', async t => {
  for await (const store of storeFixture()) {
    let size = await store.size
    t.equal(size, 0, 'should get size 0 after init')
    await store.set(KEY, VAL)
    size = await store.size
    t.equal(size, 1, 'should get count 1 after put')
  }
})

test('async keys()', async t => {
  for await (const store of storeFixture()) {
    let count = 0
    for await (const _ of store.keys()) {
      count++
    }
    t.equal(count, 0, 'should get 0 key after init')

    await store.set(KEY, VAL)
    for await (const key of store.keys()) {
      t.equal(key, KEY, 'should get back the key')
      count++
    }
    t.equal(count, 1, 'should get 1 key after 1 put')
  }
})

test('async values()', async t => {
  for await (const store of storeFixture()) {
    let count = 0
    for await (const _ of store.values()) {
      count++
    }
    t.equal(count, 0, 'should get 0 value after init')

    await store.set(KEY, VAL)

    for await (const value of store.values()) {
      t.equal(value, VAL, 'should get back the value')
      count++
    }
    t.equal(count, 1, 'should get 1 value after 1 put')
  }
})

// test('deferred-leveldown json bug(fixed on version 2.0.2', async t => {
//   const encoding  = (await import('encoding-down')).default
//   const leveldown = (await import('leveldown')).default
//   const levelup   = (await import('levelup')).default

//   const tmpDir = fs.mkdtempSync(
//     path.join(
//       os.tmpdir(),
//       path.sep,
//       'flash-store-',
//     ),
//   )

//   const encoded = encoding(leveldown(tmpDir) as any, {
//     valueEncoding: 'json',
//   })
//   const levelDb = levelup(encoded)

//   const EXPECTED_OBJ = {a: 1}
//   await levelDb.put('test', EXPECTED_OBJ)
//   const value = await levelDb.get('test')

//   t.equal(typeof value, 'object', 'value type should be object')
//   t.deepEqual(value, EXPECTED_OBJ, 'should get back the original object')

//   // `rm -fr tmpDir`
//   await new Promise(r => rimraf(tmpDir, r))
// })

async function * storeFixture () {
  const tmpDir = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      path.sep,
      'flash-store-',
    ),
  )
  const store = new FlashStore(tmpDir)

  yield store

  await store.destroy()
}
