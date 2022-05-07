import type {
  NativeType,
  PointerType,
}               from '../../frida.js'
import {
  log,
}               from '../../config.js'

import {
  guardPointerType,
  guardNativeType,
  ReflectedDesignType,
}                       from '../../type-guard.js'

/**
 * Verify the TypeScript param type is matching the NativeType from `ParamType`
 */
function guardParamType (
  target          : Object,
  propertyKey     : string,
  parameterIndex  : number,
  nativeType      : NativeType,
  pointerTypeList : PointerType[],
): void {
  const designParamTypeList = Reflect.getMetadata('design:paramtypes', target, propertyKey) as ReflectedDesignType[]
  const designParamType = designParamTypeList[parameterIndex]

  log.verbose('Sidecar',
    'guardParamType(%s, %s, %s) %s.%s(args[%s]) designType/nativeType/pointerTypes: %s/%s/%s',
    target.constructor.name,
    propertyKey,
    parameterIndex,

    target.constructor.name,
    propertyKey,
    parameterIndex,

    designParamType?.name ?? 'void',
    nativeType,
    pointerTypeList.join(','),
  )

  try {
    guardNativeType(nativeType)(designParamType)
    if (nativeType === 'pointer') {
      guardPointerType(pointerTypeList)(designParamType)
    }
  } catch (e) {
    log.error('Sidecar', [
      `The "${target.constructor.name}.${String(propertyKey)}(args[${parameterIndex}])`,
      `decorated by "@ParamType(${nativeType}, ...)"`,
      `does match the design type "${designParamType?.name}"`,
    ].join('\n'))
    throw e
  }
}

export { guardParamType }
