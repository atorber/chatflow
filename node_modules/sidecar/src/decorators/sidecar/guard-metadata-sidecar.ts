import {
  log,
}               from '../../config.js'

import type { SidecarMetadata } from './metadata-sidecar.js'

/**
 * Verify the Sidecar Metadata is satisfy as a whole
 */
function guardMetadataSidecar (
  meta: SidecarMetadata,
): void {
  log.verbose('Sidecar', 'guardMetadataSidecar(meta)')

  for (const desc of meta.nativeFunctionList) {
    /**
     * Huan(202108): Check for `AgentTarget`: the agentTarget
     *  will be mapped to a JavaScript function
     *  inside the `initAgentScript` source code.
     *
     * Which means that it should not be annoated
     *  by either `@ParamType` or `RetType`
     */
    if (desc.agent) {
      if (desc.agent.paramTypeList.length > 0) {
        throw new Error([
          `The sidecar method "${desc.agent.name}" is decorated as 'AgentType'`,
          'which means that it will be mapped to a JavaScript function',
          'in `initAgentScript` source code,',
          'So decorated it with `@ParamType() is not allowed`,',
          'Remove `@ParamType` and try again.',
        ].join('\n'))
      }
      if (desc.agent.retType) {
        throw new Error([
          `The sidecar method "${desc.agent.name}" is decorated as 'AgentType'`,
          'which means that it will be mapped to a JavaScript function',
          'in `initAgentScript` source code,',
          'So decorated it with `@RetType() is not allowed`,',
          'Remove `@RetType` and try again.',
        ].join('\n'))
      }
    }
  }
}

export { guardMetadataSidecar }
