// import { log } from '../config.js'
import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'
import { log } from '../config.js'

function jsRet (
  this: SidecarMetadataFunctionDescription,
): string {
  const typeChain = this.retType
  if (!typeChain) {
    // throw new Error('no .retType found in SidecarMetadataFunctionDescription context!')
    /**
     * Huan(202108): No type chain means we have not specified `@RetType`
     *  return raw data
     */
    return 'ret'
  }

  const [nativeType, ...pointerTypeList] = typeChain
  // console.log(nativeType, pointerTypeList)

  const resultChain = []

  if (nativeType === 'pointer') {
    /**
     * Pointer native type mapping/chaining
     */
    if (pointerTypeList.length > 0) {
      resultChain.push(
        'ret.readPointer()'
      )
      for (const pointerType of pointerTypeList) {
        resultChain.push(
          `.read${pointerType}()`
        )
      }
    } else {
      /**
       * Raw pointer
       */
      resultChain.push('ret')
    }
  } else {
    /**
     * Non-pointer native type mapping
     */
    switch (nativeType) {
      case 'bool':
        log.silly('Sidecar', 'wrappers/js-ret NativeType(bool) for ret')
        resultChain.push('Boolean(ret)')
        break
      case 'void':
        log.silly('Sidecar', 'wrappers/js-ret NativeType(void) for ret')
        resultChain.push('undefined /* void */')
        break
      default:  // all number types
        log.silly('Sidecar', 'wrappers/js-ret NativeType(number<%s>) for ret', nativeType)
        resultChain.push('Number(ret)')
        break
    }
  }

  return resultChain.join('')
}

export { jsRet }
