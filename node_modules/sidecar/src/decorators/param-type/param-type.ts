/**
 * Data Type:
 *  https://en.wikipedia.org/wiki/Data_type
 *
 * TypeScript Decorators: Parameter Decorators
 *  https://blog.wizardsoftheweb.pro/typescript-decorators-parameter-decorators/
 */
import type {
  NativeType,
  PointerType,
}               from '../../frida.js'
import {
  log,
}               from '../../config.js'

import { updateMetadataParamType }  from './metadata-param-type.js'
import { guardParamType }           from './guard-param-type.js'

function ParamType (
  nativeType         : NativeType,
  ...pointerTypeList : PointerType[]
) {
  log.verbose('Sidecar',
    '@ParamType(%s%s)',
    nativeType,
    pointerTypeList.length > 0
      ? `, [${pointerTypeList.join(',')}]`
      : '',
  )

  return function paramTypeDecorator (
    target         : Object,
    propertyKey    : string,
    parameterIndex : number,
  ) {
    log.verbose('Sidecar',
      '@ParamType(%s%s) paramTypeDecorator (%s, %s, %s)',
      nativeType,
      pointerTypeList.length > 0
        ? `, [${pointerTypeList.join(',')}]`
        : '',

      target.constructor.name,
      propertyKey,
      parameterIndex,
    )

    guardParamType(
      target,
      propertyKey,
      parameterIndex,
      nativeType,
      pointerTypeList,
    )

    updateMetadataParamType(
      target,
      propertyKey,
      parameterIndex,
      [nativeType, ...pointerTypeList],
    )
  }
}

export { ParamType }
