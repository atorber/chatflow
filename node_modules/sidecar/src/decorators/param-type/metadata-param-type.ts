import type {
  TypeChain,
}                 from '../../frida.js'

import { PARAM_TYPE_SYMBOL } from './constants.js'

function updateMetadataParamType (
  target         : Object,
  propertyKey    : string,
  parameterIndex : number,
  typeChain      : TypeChain,
): void {
  // Pull the array of parameter names
  const parameterTypeList = Reflect.getOwnMetadata(
    PARAM_TYPE_SYMBOL,
    target,
    propertyKey,
  ) || []
  // Add the current parameter name
  parameterTypeList[parameterIndex] = typeChain
  // Update the parameter names
  Reflect.defineMetadata(
    PARAM_TYPE_SYMBOL,
    parameterTypeList,
    target,
    propertyKey,
  )
}

function getMetadataParamType (
  target         : Object,
  propertyKey    : string,
): TypeChain[] {
  // Pull the array of parameter names
  const parameterTypeList = Reflect.getMetadata(
    PARAM_TYPE_SYMBOL,
    target,
    propertyKey,
  )
  return parameterTypeList || []
}

export {
  getMetadataParamType,
  updateMetadataParamType,
}
