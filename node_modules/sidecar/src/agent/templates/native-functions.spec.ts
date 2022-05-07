#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import Mustache from  'mustache'

import {
  partialLookup,
}                         from '../partial-lookup.js'

import { getSidecarMetadataFixture } from '../../../tests/fixtures/sidecar-metadata.fixture.js'

import { wrapView } from '../../wrappers/mod.js'

test('native-functions.mustache', async t => {

  const SIDECAR_METADATA = getSidecarMetadataFixture()

  const view = wrapView(SIDECAR_METADATA)

  // console.log(view.nativeFunctionList)
  const template = await partialLookup('native-functions.mustache')

  // console.log(template)
  const result = Mustache.render(template, view)

  /**
   * Huan(202106): how could we test this script has been correctly generated?
   */
  t.ok(result, 'should render to the right script (TBW)')
})
