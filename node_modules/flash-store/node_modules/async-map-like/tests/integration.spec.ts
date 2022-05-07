#!/usr/bin/env ts-node
import test from 'blue-tape'

import {
  MapLike,
  AsyncMapLike,
}               from '../src/mod'

test('integrate testing', async t => {
  let mapLike      : undefined | MapLike<any, any>
  let asyncMapLike : undefined | AsyncMapLike<any, any>

  void mapLike
  void asyncMapLike

  t.pass('should imported typing')
})
