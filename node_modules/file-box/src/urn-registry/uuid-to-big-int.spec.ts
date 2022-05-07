#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test }  from 'tstest'

import { uuidToBigInt } from './uuid-to-big-int.js'

test('uuidToBigInt() Nil UUID', async t => {
  const uuid = '00000000-0000-0000-0000-000000000000'
  const bigInt = uuidToBigInt(uuid)
  t.equal(bigInt.toString(), '0', 'should get zero for a Nil UUID')
})

test('uuidToBigInt() Nil UUID', async t => {
  const UUID = '00bd7c03-a690-48d3-a1fe-1314574e4fc1'
  const EXPECTED = BigInt('0x00bd7c03a69048d3a1fe1314574e4fc1')

  const bigInt = uuidToBigInt(UUID)
  t.equal(bigInt, EXPECTED, 'should convert UUID right')
})
