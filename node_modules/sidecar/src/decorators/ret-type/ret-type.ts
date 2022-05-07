import type {
  NativeType,
  PointerType,
}               from '../../frida.js'
import {
  log,
}               from '../../config.js'

import {
  updateMetadataRetType,
}                         from './metadata-ret-type.js'
import { guardRetType }   from './guard-ret-type.js'

function RetType (
  nativeType         : NativeType,
  ...pointerTypeList : PointerType[]
) {
  log.verbose('Sidecar', '@RetType(%s%s)',
    nativeType,
    pointerTypeList.length > 0
      ? `, [${pointerTypeList.join(',')}]`
      : '',
  )

  return function retTypeMethodDecorator (
    target      : Object,
    propertyKey : string,
    _descriptor : PropertyDescriptor,
  ) {
    log.verbose('Sidecar',
      '@RetType(%s%s) retTypeMethodDecorator(%s, %s, descriptor)',
      nativeType,
      pointerTypeList.length > 0
        ? `, [${pointerTypeList.join(',')}]`
        : '',

      target.constructor.name,
      propertyKey,
    )

    guardRetType(
      target,
      propertyKey,
      nativeType,
      pointerTypeList,
    )

    updateMetadataRetType(
      target,
      propertyKey,
      [nativeType, ...pointerTypeList],
    )
  }
}

export { RetType }
