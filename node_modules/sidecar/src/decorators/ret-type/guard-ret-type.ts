import type {
  NativeType,
  PointerType,
}               from '../../frida.js'
import {
  log,
}               from '../../config.js'

import {
  guardNativeType,
  guardPointerType,
  ReflectedDesignType,
}                       from '../../type-guard.js'

/**
 * Verify the TypeScript ret type is matching the NativeType from `RetType`
 */
function guardRetType (
  target          : Object,
  propertyKey     : string,
  nativeType      : NativeType,
  pointerTypeList : PointerType[],
): void {
  const designRetType = Reflect.getMetadata('design:returntype', target, propertyKey) as ReflectedDesignType

  log.verbose('Sidecar',
    'guardRetType(%s.%s) designType/nativeType/pointerTypeList: %s/%s/[%s]',
    target.constructor.name,
    propertyKey,

    designRetType?.name ?? 'void',
    nativeType,
    pointerTypeList.join(','),
  )

  try {
    guardNativeType(nativeType)(designRetType)
    if (nativeType === 'pointer') {
      guardPointerType(pointerTypeList)(designRetType)
    }
  } catch (e) {
    log.error('Sidecar', 'guardRetType() %s', e && (e as Error).message)
    throw new Error([
      `The ${target.constructor.name}.${String(propertyKey)}()`,
      `decorated by "@RetType(${nativeType}, ...)"`,
      `does match the design return type "${designRetType?.name ?? 'void'}"`,
    ].join('\n'))
  }

}

export { guardRetType }
