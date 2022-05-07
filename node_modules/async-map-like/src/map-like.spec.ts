#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test }  from 'tstest'

import type { MapLike } from './map-like.js'

test('MapLike Interface', async (t) => {
  const mapLike: MapLike<any, any> = new Map<any, any>()
  t.ok(mapLike, 'should be assign-able from ES6 Map to our MapLike Interface')
  t.ok(mapLike.entries(), 'should has entries function')
})
