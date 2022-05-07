import {
  log,
}                 from '../../config.js'

import type {
  FunctionTarget,
}                 from '../../function-target.js'

import { updateMetadataCall }   from './metadata-call.js'
import { updateRpcDescriptor }  from './update-rpc-descriptor.js'

function Call (
  functionTarget: FunctionTarget,
) {
  log.verbose('Sidecar', '@Call(%s)',
    typeof functionTarget === 'string' ? functionTarget
      : typeof functionTarget === 'number' ? `0x${functionTarget.toString(16)}`
        : JSON.stringify(functionTarget)
  )

  return function callMethodDecorator (
    target      : any,
    propertyKey : string,
    descriptor  : PropertyDescriptor,
  ): PropertyDescriptor {
    log.verbose('Sidecar',
      '@Call(%s) callMethodDecorator(%s, %s, descriptor)',
      typeof functionTarget === 'object' ? JSON.stringify(functionTarget)
        : typeof functionTarget === 'number' ? '0x' + functionTarget.toString(16)
          : functionTarget,

      target.constructor.name,
      propertyKey,
    )

    updateMetadataCall(
      target,
      propertyKey,
      functionTarget,
    )

    const rpcDescriptor = updateRpcDescriptor(
      target,
      propertyKey,
      descriptor,
    )

    return rpcDescriptor
  }
}

export { Call }
