import {
  log,
}                         from '../../config.js'

import type {
  FunctionTarget,
}                         from '../../function-target.js'

const HOOK_TARGET_SYMBOL = Symbol('hookTarget')

function updateMetadataHook (
  target         : Object,
  propertyKey    : string,
  functionTarget : FunctionTarget,
): void {
  // Update the parameter names
  Reflect.defineMetadata(
    HOOK_TARGET_SYMBOL,
    functionTarget,
    target,
    propertyKey,
  )
}

function getMetadataHook (
  target      : Object,
  propertyKey : string,
): undefined | FunctionTarget {
  // Pull the array of parameter names
  const functionTarget = Reflect.getMetadata(
    HOOK_TARGET_SYMBOL,
    target,
    propertyKey,
  )
  return functionTarget
}

function Hook (
  functionTarget: FunctionTarget,
) {
  log.verbose('Sidecar', '@Hook(%s)',
    typeof functionTarget === 'object' ? JSON.stringify(functionTarget)
      : typeof functionTarget === 'number' ? functionTarget.toString(16)
        : functionTarget,
  )

  return function hookMethodDecorator (
    target      : Object,
    propertyKey : string,
    descriptor  : PropertyDescriptor,
  ): PropertyDescriptor {
    log.verbose('Sidecar',
      '@Hook(%s) hookMethodDecorator(%s, %s, descriptor)',
      typeof functionTarget === 'object' ? JSON.stringify(functionTarget)
        : typeof functionTarget === 'number' ? functionTarget.toString(16)
          : functionTarget,

      target.constructor.name,
      propertyKey,
    )

    updateMetadataHook(
      target,
      propertyKey,
      functionTarget,
    )

    // Huan(202106) TODO: add a replaced function to show a error message when be called.
    return descriptor
  }
}

export {
  Hook,
  getMetadataHook,
  HOOK_TARGET_SYMBOL,
}
