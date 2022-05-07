const jsArgName = (
  method: string,
  argIdx: number,
) => `${method}_JsArg_${argIdx}`

const nativeArgName = (
  method: string,
  argIdx: number,
) => `${method}_NativeArg_${argIdx}`

const argName = (idx: number) => `args[${idx}]`

const bufName = (
  method   : string,
  argIdx   : number,
  typeIdx? : number,
) => [
  `${method}_Memory_${argIdx}`,
  typeof typeIdx === 'undefined'
    ? ''
    : `_${typeIdx}`,
].join('')

export {
  argName,
  bufName,
  jsArgName,
  nativeArgName,
}
