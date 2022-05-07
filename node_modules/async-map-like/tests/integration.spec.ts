#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test } from 'tstest'

import type {
  MapLike,
  AsyncMapLike,
}               from '../src/mod.js'

test('integrate testing', async t => {
  let mapLike      : undefined | MapLike<any, any>
  let asyncMapLike : undefined | AsyncMapLike<any, any>

  void mapLike
  void asyncMapLike

  t.pass('should imported typing')
})
