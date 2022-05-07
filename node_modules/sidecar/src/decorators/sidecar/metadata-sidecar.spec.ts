#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import { getSidecarMetadataFixture } from '../../../tests/fixtures/sidecar-metadata.fixture.js'

import {
  getMetadataSidecar,
  updateMetadataSidecar,
}                         from './metadata-sidecar.js'

test('update & get view metadata', async t => {
  const VALUE = getSidecarMetadataFixture()
  const TARGET = {}

  updateMetadataSidecar(
    TARGET,
    VALUE,
  )

  const data = getMetadataSidecar(
    TARGET,
  )

  t.same(data, VALUE, 'should get the view data the same as we set(update)')
})
