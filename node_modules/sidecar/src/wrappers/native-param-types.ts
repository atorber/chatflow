import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'

function nativeParamTypes (
  this: SidecarMetadataFunctionDescription,
): string {
  /**
   * There's no any parameters
   */
  if (!this.paramTypeList || this.paramTypeList.length === 0) {
    return '[]'
  }
  return '[ '
    + this.paramTypeList
      .map(paramType => `'${paramType[0]}'`)
      .join(', ')
    + ' ]'
}

export { nativeParamTypes }
