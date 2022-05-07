#!/usr/bin/env ts-node

import { test } from 'tstest'

import { StorageFile } from './file.js'

test('smoke testing', async t => {
  const EXPECTED_PAYLOAD = { mol: 42 }
  const NAME             = Math.random().toString().substr(2)

  const file = new StorageFile(
    NAME,
    {},
  )

  let empty = await file.load()
  t.deepEqual(empty, {}, 'should get back a empty object for non-exist data')

  await file.save(EXPECTED_PAYLOAD)
  const payload = await file.load()

  t.deepEqual(payload, EXPECTED_PAYLOAD, 'should get back data from s3')

  await file.destroy()

  empty = await file.load()
  t.deepEqual(empty, {}, 'should get back a empty object after destroy()')
})
