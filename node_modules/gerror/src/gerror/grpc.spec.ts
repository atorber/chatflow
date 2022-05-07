#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { isGrpcStatus } from './grpc.js'

test('gRPC smoke testing', async t => {
  const payload = {
    code: 2,
    details: undefined,
  }

  t.ok(isGrpcStatus(payload), 'should be grpc payload')
})
