#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import Mustache from  'mustache'

import {
  partialLookup,
}                         from '../partial-lookup.js'

import { getSidecarMetadataFixture } from '../../../tests/fixtures/sidecar-metadata.fixture.js'

import { wrapView } from '../../wrappers/mod.js'

test('interceptors.mustache', async t => {

  const SIDECAR_VIEW = getSidecarMetadataFixture()

  const view = wrapView(SIDECAR_VIEW)

  // console.log(JSON.stringify(view.interceptorList, null, 2))
  const template = await partialLookup('interceptors.mustache')

  // console.log(template)
  const result = Mustache.render(template, view)
  // console.log(result)

  /**
   * Huan(202106): how could we test this script has been correctly generated?
   */
  t.ok(result, 'should render to the right script (TBW)')
})
