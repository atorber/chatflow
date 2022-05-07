#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { StorageObs } from './obs.js'

import { OBS_SETTING } from '../../tests/fixtures.js'

test.skip('huawei obs storage smoke testing', async t => {
  const EXPECTED_PAYLOAD = { mol: 42 }
  const NAME             = Math.random().toString().substr(2)

  const s3 = new StorageObs(
    NAME,
    {
      accessKeyId     : OBS_SETTING.ACCESS_KEY_ID,
      bucket          : OBS_SETTING.BUCKET,
      secretAccessKey : OBS_SETTING.SECRET_ACCESS_KEY,
      server          : OBS_SETTING.SERVER,
    },
  )

  let empty = await s3.load()
  t.same(empty, {}, 'should get back a empty object for non-exist data')

  await s3.save(EXPECTED_PAYLOAD)
  const payload = await s3.load()

  t.same(payload, EXPECTED_PAYLOAD, 'should get back data from obs')

  await s3.destroy()

  empty = await s3.load()
  t.same(empty, {}, 'should get back a empty object after destroy()')
})
