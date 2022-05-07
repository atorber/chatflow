import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'

function nativeRetType (this: SidecarMetadataFunctionDescription) {
  // console.log('this.retType', this.retType)
  if (!this.retType || this.retType.length <= 0) {
    return "'void'"
  }
  return `'${this.retType[0]}'`
}

export { nativeRetType }
