#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import { ChatboxSidecar }   from '../../examples/chatbox-sidecar.js'
import { getMetadataSidecar }  from '../decorators/sidecar/metadata-sidecar.js'

// import { Call, RetType, Sidecar } from '../decorators/mod.js'
// import { sidecarMetadata } from '../decorators/sidecar/sidecar-metadata.js'
// import { Ret } from '../ret.js'
// import { SidecarBody } from '../sidecar-body/sidecar-body.js'

import {
  buildAgentSource,
}                         from './build-agent-source.js'
import { getSidecarMetadataFixture } from '../../tests/fixtures/sidecar-metadata.fixture.js'

test('buildAgentSource() from fixture', async t => {
  const metadata = getSidecarMetadataFixture()

  const source = await buildAgentSource(metadata)

  // console.log(source)
  t.ok(source, 'ok (tbw)')
})

test('buildAgentSource() from example demo', async t => {

  const metadata = getMetadataSidecar(ChatboxSidecar)!
  // console.log(JSON.stringify(view, null, 2))

  const source = await buildAgentSource(metadata)

  // console.log(source)
  t.ok(source, 'ok')
})
