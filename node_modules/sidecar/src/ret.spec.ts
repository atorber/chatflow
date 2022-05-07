#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  RET_SYMBOL,
  Ret,
}                         from './ret.js'

test('Ret()', async t => {
  const p = Ret()
  t.equal(p.constructor.name, 'Promise', 'should get a promise from Ret()')

  const r = await p
  t.equal(r, RET_SYMBOL, 'should return RET_SYMBOL by calling Ret()')
})
