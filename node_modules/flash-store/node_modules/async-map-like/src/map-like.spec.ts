#!/usr/bin/env ts-node

import { test }  from 'tstest'

import { MapLike } from './map-like'

test('MapLike Interface', async (t) => {
  const mapLike: MapLike<any, any> = new Map<any, any>()
  t.ok(mapLike, 'should be assign-able from ES6 Map to our MapLike Interface')
  t.ok(mapLike.entries(), 'should has entries function')
})
