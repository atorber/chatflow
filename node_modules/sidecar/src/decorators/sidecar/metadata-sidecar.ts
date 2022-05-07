import {
  log,
}                       from '../../config.js'
import type {
  TypeChain,
}                       from '../../frida.js'
import type {
  TargetPayloadObj,
  FunctionTargetType,
}                     from '../../function-target.js'

import { SIDECAR_SYMBOL }   from './constants.js'
import type { SidecarTargetObj } from './target.js'

export interface SidecarMetadataFunctionDescription {
  name          : string
  paramTypeList : TypeChain[]
  retType?      : TypeChain
  target        : TargetPayloadObj,
}

export type SidecarMetadataFunctionTypeDescription = {
  [type in FunctionTargetType]?: SidecarMetadataFunctionDescription
}

export interface SidecarMetadata {
  nativeFunctionList : SidecarMetadataFunctionTypeDescription[],
  interceptorList    : SidecarMetadataFunctionTypeDescription[],
  initAgentScript?   : string,
  sidecarTarget?     : SidecarTargetObj,
}

function updateMetadataSidecar (
  target : any,
  view   : SidecarMetadata,
): void {
  log.verbose('Sidecar', 'updateMetadataSidecar(%s, "%s...")',
    target.name,
    JSON.stringify(view).substr(0, 20),
  )
  // log.silly('Sidecar', 'updateMetadataSidecar(%s, %s)',
  //   target.name,
  //   JSON.stringify(view)
  // )

  // Update the parameter names
  Reflect.defineMetadata(
    SIDECAR_SYMBOL,
    view,
    target,
  )
}

function getMetadataSidecar (
  target      : Object,
): undefined | SidecarMetadata {
  // Pull the array of parameter names
  const view = Reflect.getMetadata(
    SIDECAR_SYMBOL,
    target,
  )
  return view
}

export {
  getMetadataSidecar,
  updateMetadataSidecar,
}
