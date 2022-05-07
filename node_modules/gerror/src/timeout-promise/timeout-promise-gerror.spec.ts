#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { Code } from '../gerror/grpc.js'

import { TimeoutPromiseGError } from './timeout-promise-gerror.js'

test('TimeoutPromiseGError smoke testing', async t => {
  const MSG = 'test'
  const e = TimeoutPromiseGError.from(MSG)
  t.equal(e.code, Code.DEADLINE_EXCEEDED, 'should init code to Code.DEADLINE_EXECEEDED')
  t.equal(e.name, 'DEADLINE_EXCEEDED', 'should init name to "DEADLINE_EXECEEDED"')
  t.equal(e.message, MSG, 'should init message to MSG')

  t.ok(e.stack, 'should have stack')
  t.equal(e.details, e.stack, 'should set details from stack')
})
