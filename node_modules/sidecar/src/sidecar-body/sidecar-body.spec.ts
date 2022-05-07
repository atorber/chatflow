#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  SidecarBody,
}                         from './sidecar-body.js'

/**
 * Huan(202106):
 *  Should we support the multi-instance of Sidecar,
 *  or NOT?
 */
test.skip('SidecarBody enforce singleton', async t => {

  class SidecarTest extends SidecarBody {}

  const s1 = new SidecarTest()
  const s2 = new SidecarTest()

  t.equal(s1, s2, 'should be the same instance of SidecarBody')
})

test('Class intance constructor should be the Class Function', async t => {
  class Test {}
  const test = new Test()

  t.ok(test.constructor === Test, 'should be equal')
})
