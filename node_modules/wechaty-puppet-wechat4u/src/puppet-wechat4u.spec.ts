#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { PuppetWechat4u } from './puppet-wechat4u.js'

class PuppetWechat4uTest extends PuppetWechat4u {
}

/**
 * Huan(202110): skip this test for now
 */
test.skip('PuppetWechat4u restart without problem', async t => {
  const puppet = new PuppetWechat4uTest()
  try {
    for (let i = 0; i < 3; i++) {
      await puppet.start()
      await puppet.stop()
      t.pass('start/stop-ed at #' + i)
    }
    t.pass('PuppetWechat4u() start/restart successed.')
  } catch (e) {
    t.fail(e as any)
  }
})
