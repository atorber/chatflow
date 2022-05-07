import Mustache from  'mustache'

import type { SidecarMetadata } from '../decorators/sidecar/metadata-sidecar.js'

import { wrapView }       from '../wrappers/mod.js'

import { log } from '../config.js'

import { partialLookup }  from './partial-lookup.js'

const AGENT_MUSTACHE = 'agent.mustache'

async function buildAgentSource (metadata: SidecarMetadata) {
  log.verbose('Sidecar', 'buildAgentSource("%s...")', JSON.stringify(metadata).substr(0, 20))
  // log.silly('Sidecar', 'buildAgentSource(%s)', JSON.stringify(metadata))

  const agentMustache = partialLookup(AGENT_MUSTACHE)
  const view = wrapView(metadata)

  const source = await Mustache.render(
    agentMustache,
    view,
    partialLookup,
  )

  return source
}

export { buildAgentSource }
