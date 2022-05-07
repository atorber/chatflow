import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'

function jsArgs (
  this: SidecarMetadataFunctionDescription
): string {
  const typeList = this.paramTypeList
  if (!typeList) {
    throw new Error('no .paramTypeList found in SidecarMetadataFunctionDescription!')
  }

  const wrappedArgNameList = typeList
    .map((_, i) => i)
    .map(i => `${this.name}_JsArg_${i}`)

  return '[ ' + wrappedArgNameList.join(', ') + ' ]'
}

export { jsArgs }
