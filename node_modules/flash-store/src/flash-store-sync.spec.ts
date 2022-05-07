#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import fs     from 'fs'
import path   from 'path'
import os     from 'os'

import { test } from 'tstest'

// import { log }    from './config'
// log.level('silly')

import {
  FlashStoreSync,
}                   from './flash-store-sync.js'

async function * storeSyncFixture () {
  const tmpDir = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      path.sep,
      'cache-store-',
    ),
  )
  const storeSync = new FlashStoreSync(tmpDir)

  yield storeSync

  await storeSync.destroy()
}

const KEY     = 'test-key'
const VAL     = 'test-val'
const VAL_OBJ = { obj_key: 'obj_val' }

test('version()', async t => {
  for await (const storeSync of storeSyncFixture()) {
    t.ok(storeSync.version().match(/^\d+\.\d+\.\d+$/), 'should get semver version')
  }
})

test('Store as iterator', async t => {

  await t.test('iterator for empty store', async t => {
    for await (const storeSync of storeSyncFixture()) {
      let n = 0
      for (const _ of storeSync) {
        n++
        // break
      }
      t.equal(n, 0, 'should get empty iterator')
    }
  })

  await t.test('async iterator', async t => {
    for await (const storeSync of storeSyncFixture()) {
      storeSync.set(KEY, VAL)
      let n = 0
      for (const [key, val] of storeSync) {
        t.equal(key, KEY, 'should get key back')
        t.equal(val, VAL, 'should get val back')
        n++
      }
      t.equal(n, 1, 'should iterate once')
    }
  })

})

test('get()', async t => {
  await t.test('return null for non existing key', async t => {
    for await (const storeSync of storeSyncFixture()) {
      const val = storeSync.get(KEY)
      t.equal(val, undefined, 'should get undefined for not exist key')
    }
  })

  await t.test('store string key/val', async t => {
    for await (const storeSync of storeSyncFixture()) {
      storeSync.set(KEY, VAL)
      const val = storeSync.get(KEY)
      t.equal(val, VAL, 'should get VAL after set KEY')
    }
  })

  await t.test('store object value', async t => {
    for await (const storeSync of storeSyncFixture()) {
      storeSync.set(KEY, VAL_OBJ)
      const val = storeSync.get(KEY)
      t.same(val, VAL_OBJ, 'should get VAL_OBJ after set KEY')
    }
  })
})

test('set()', async t => {
  for await (const storeSync of storeSyncFixture()) {
    storeSync.set(KEY, VAL)
    const val = storeSync.get(KEY)
    t.equal(val, VAL, 'should set VAL for KEY')
  }
})

test('size()', async t => {
  for await (const storeSync of storeSyncFixture()) {
    let size = storeSync.size
    t.equal(size, 0, 'should get size 0 after init')
    storeSync.set(KEY, VAL)
    size = storeSync.size
    t.equal(size, 1, 'should get count 1 after put')
  }
})

test('keys()', async t => {
  for await (const storeSync of storeSyncFixture()) {
    let count = 0
    for (const _ of storeSync.keys()) {
      count++
    }
    t.equal(count, 0, 'should get 0 key after init')

    storeSync.set(KEY, VAL)
    for (const key of storeSync.keys()) {
      t.equal(key, KEY, 'should get back the key')
      count++
    }
    t.equal(count, 1, 'should get 1 key after 1 put')
  }
})

test('values()', async t => {
  for await (const storeSync of storeSyncFixture()) {
    let count = 0
    for (const _ of storeSync.values()) {
      count++
    }
    t.equal(count, 0, 'should get 0 value after init')

    storeSync.set(KEY, VAL)

    for (const value of storeSync.values()) {
      t.equal(value, VAL, 'should get back the value')
      count++
    }
    t.equal(count, 1, 'should get 1 value after 1 put')
  }
})

test('close()', async t => {
  for await (const storeSync of storeSyncFixture()) {
    storeSync.set('KEY1', VAL)
    storeSync.set('KEY2', VAL)
    storeSync.set('KEY3', VAL)
    storeSync.set('KEY4', VAL)
    storeSync.set('KEY5', VAL)

    await storeSync.close()
    t.pass('should close')
  }
})
