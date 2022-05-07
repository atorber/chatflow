#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import { getSidecarMetadataFixture } from '../../../tests/fixtures/sidecar-metadata.fixture.js'

import {
  guardMetadataSidecar,
}                         from './guard-metadata-sidecar.js'

test('guardMetadataSidecar() for valid agent target', async t => {
  const fixture = getSidecarMetadataFixture()
  t.doesNotThrow(() => guardMetadataSidecar(fixture), 'should validate the fixture')
})

test('guardMetadataSidecar() for invalid agent target: @ParamType', async t => {
  const fixture = getSidecarMetadataFixture()
  // get the first AgentTarget descriptor
  const desc = fixture.nativeFunctionList.filter(x => x.agent)[0]!
  desc.agent!.paramTypeList = [
    ['pointer'],
  ]

  t.throws(() => guardMetadataSidecar(fixture), 'should throw for invalid agent target descriptor: unnecessary @ParamType')
})

test('guardMetadataSidecar() for invalid agent target: @RetType', async t => {
  const fixture = getSidecarMetadataFixture()
  // get the first AgentTarget descriptor
  const desc = fixture.nativeFunctionList.filter(x => x.agent)[0]!
  desc.agent!.retType = ['pointer']

  t.throws(() => guardMetadataSidecar(fixture), 'should throw for invalid agent target descriptor: unnecessary @RetType')
})
