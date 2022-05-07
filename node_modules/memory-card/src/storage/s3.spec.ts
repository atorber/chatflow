#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import {
  AWS_SETTING,
}                 from '../../tests/fixtures.js'

import { StorageS3 } from './s3.js'

test('amazon s3 storage smoke testing', async t => {
  if (!AWS_SETTING) {
    await t.skip('AWS S3 environment variables not set.')
    return
  }

  const EXPECTED_PAYLOAD = { mol: 42 }
  const NAME             = 'tmp/memory-card-unit-test-' + Math.random().toString().substr(2)

  const s3 = new StorageS3(
    NAME,
    AWS_SETTING,
  )

  let empty = await s3.load()
  t.deepEqual(empty, {}, 'should get back a empty object for non-exist data')

  await s3.save(EXPECTED_PAYLOAD)
  const payload = await s3.load()

  t.deepEqual(payload, EXPECTED_PAYLOAD, 'should get back data from s3')

  await s3.destroy()

  empty = await s3.load()
  t.deepEqual(empty, {}, 'should get back a empty object after destroy()')
})
