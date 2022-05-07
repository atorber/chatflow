import {
  log,
}         from '../../config.js'

import { SidecarBody } from '../../sidecar-body/sidecar-body.js'
import { buildSidecarMetadata } from './build-sidecar-metadata.js'
import { guardMetadataSidecar } from './guard-metadata-sidecar.js'

import { updateMetadataSidecar }  from './metadata-sidecar.js'
import type {
  SidecarTarget,
}                                 from './target.js'

function Sidecar (
  sidecarTarget    : SidecarTarget,
  initAgentScript? : string,
) {
  log.verbose('Sidecar', '@Sidecar(%s%s)',
    Array.isArray(sidecarTarget)
      ? JSON.stringify(sidecarTarget)
      : sidecarTarget,
    initAgentScript
      ? `, "${initAgentScript.substr(0, 20)}..."`
      : '',
  )

  return classDecorator

  /**
   * See: https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
   */
  function classDecorator <
    T extends {
      new (...args: any[]): {},
    }
  > (
    Klass: T,
  ) {
    log.verbose('Sidecar',
      '@Sidecar(%s%s) classDecorator(%s)',
      Array.isArray(sidecarTarget)
        ? JSON.stringify(sidecarTarget)
        : (sidecarTarget || ''),
      `"${initAgentScript?.substr(0, 20)}..."` || '',
      Klass.name,
    )

    // https://stackoverflow.com/a/14486171/1123955
    if (!(Klass.prototype instanceof SidecarBody)) {
      throw new Error('Sidecar: the class decorated by @Sidecar must extends from `SidecarBody`')
    }

    const meta = buildSidecarMetadata(Klass, {
      initAgentScript,
      sidecarTarget,
    })

    /**
     * Validate metadata for sidecar
     */
    guardMetadataSidecar(meta)

    /**
     * Save metadata
     */
    updateMetadataSidecar(Klass, meta)
  }
}

export { Sidecar }
