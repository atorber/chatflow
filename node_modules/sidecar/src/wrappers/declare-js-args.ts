import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'

import {
  argName,
  jsArgName,
}                 from './name-helpers.js'

function declareJsArgs (
  this: SidecarMetadataFunctionDescription
): string {
  const typeList = this.paramTypeList
  if (!typeList) {
    throw new Error('no .paramTypeList found in SidecarMetadataFunctionDescription!')
  }

  const argDeclarationList = []
  for (const [idx, typeChain] of typeList.entries()) {
    const [nativeType, ...pointerTypeList] = typeChain
    // console.log(nativeType, pointerTypeList)

    const readChain = [
      argName(idx),
    ]

    /**
     * 1. native pointer
     */
    if (nativeType === 'pointer') {
      for (const pointerType of pointerTypeList) {
        readChain.push(
          `.read${pointerType}()`
        )
      }
    }

    const declaration = 'const ' + jsArgName(this.name, idx) + ' = ' + readChain.join('')
    argDeclarationList.push(declaration)
  }

  return argDeclarationList.join('\n')
}

export { declareJsArgs }
