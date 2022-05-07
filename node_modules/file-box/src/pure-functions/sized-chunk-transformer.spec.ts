#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/* eslint @typescript-eslint/no-unused-vars:off */

import { test } from 'tstest'

import {
  PassThrough,
  Readable,
}                     from 'stream'

import { sizedChunkTransformer } from './sized-chunk-transformer.js'

test('chunkerTransformStream()', async t => {
  const DATA_LIST = [
    'a',
    'b',
  ]
  const DATA = DATA_LIST.join('')

  const createStream = () => {
    const stream = new PassThrough()
    stream.end(DATA)
    return stream
  }

  const getDataList = (stream: Readable) => {
    return new Promise<any[]>(resolve => {
      const list = [] as any[]
      stream.on('end', () => resolve(list))
      stream.on('data', chunk => list.push(chunk))
    })
  }

  const newStream0 = createStream()
  const dataList0 = await getDataList(newStream0)

  t.equal(dataList0.length, 1, 'should get 1 chunks')
  t.equal(dataList0[0].toString(), DATA, 'should get data')

  const newStream1 = createStream().pipe(sizedChunkTransformer(2))
  const dataList1 = await getDataList(newStream1)

  t.equal(dataList1.length, 1, 'should get 1 chunks')
  t.equal(dataList1[0].toString(), DATA, 'should get data')

  const newStream2 = createStream().pipe(sizedChunkTransformer(1))
  const dataList2 = await getDataList(newStream2)

  t.equal(dataList2.length, 2, 'should get 2 chunks')
  t.equal(dataList2.join(''), DATA, 'should get data')
})
