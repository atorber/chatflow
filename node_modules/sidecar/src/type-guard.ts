import type {
  NativeType,
  PointerType,
}               from './frida.js'

/**
 * Reflect Metadata:
 *    design:type
 *    design:paramtypes
 *    design:returntype
 *  http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4#3-basic-type-serialization_1
 */
export type ReflectedDesignType = typeof undefined
                                | typeof Boolean
                                | typeof Buffer
                                | typeof Number
                                | typeof Promise
                                | typeof String

const undefinedNativeTypes  = [
  'pointer',
  'void',
]                                         as NativeType[]
const undefinedPointerTypes = []          as PointerType[]

const bufferNativeTypes  = ['pointer']    as NativeType[]
const bufferPointerTypes = ['ByteArray']  as PointerType[]

const stringNativeTypes = ['pointer']     as NativeType[]
const stringPointerTypes = [
  'AnsiString',
  'CString',
  'Utf16String',
  'Utf8String',
]                                         as PointerType[]

const numberNativeTypes = [
  'pointer',
  'int',
  'uint',
  'long',
  'ulong',
  'char',
  'uchar',
  'size_t',
  'ssize_t',
  'float',
  'double',
  'int8',
  'uint8',
  'int16',
  'uint16',
  'int32',
  'uint32',
  'int64',
  'uint64',
]                                       as NativeType[]
const numberPointerTypes = [
  'S8',
  'U8',
  'S16',
  'U16',
  'S32',
  'U32',
  'Short',
  'UShort',
  'Int',
  'UInt',
  'Float',
  'Double',
  'S64',
  'U64',
  'Long',
  'ULong',
]                                       as PointerType[]

const booleanNativeTypes = [
  'pointer',
  'bool',
]                                       as NativeType[]
const booleanPointerTypes = []          as PointerType[]

/**
 * The main table for storing compatible native & pointer types for design types.
 */
const designTypesCompatibleTable = new Map<
  ReflectedDesignType,
  [
    nativeTypeList: NativeType[],
    pointerTypeList: PointerType[],
  ]
>()
  /**
   * Huan(202107): TypeScript can not get the ReturnType<Promise<???>> today (v4.4)
   */
  .set(Promise, [
    [],
    [],
  ])
  .set(undefined, [
    undefinedNativeTypes,
    undefinedPointerTypes,
  ])
  .set(Buffer, [
    bufferNativeTypes,
    bufferPointerTypes,
  ])
  .set(String, [
    stringNativeTypes,
    stringPointerTypes,
  ])
  .set(Number, [
    numberNativeTypes,
    numberPointerTypes,
  ])
  .set(Boolean, [
    booleanNativeTypes,
    booleanPointerTypes,
  ])

const guardNativeType = (nativeType: NativeType) => (designType: ReflectedDesignType) => {
  if (!designTypesCompatibleTable.has(designType)) {
    throw new Error(`Unsupported designType: ${(typeof designType)} ${(designType && designType.name)} ${designType}`)
  }

  const typeList = designTypesCompatibleTable.get(designType)
  if (!typeList) {
    throw new Error('nativeType can not found from designToNativeTypeTable[' + designType + ']')
  }

  const [nativeTypeList, _] = typeList

  // [] means allow all
  if (nativeTypeList.length > 0 && !nativeTypeList.includes(nativeType)) {
    throw new Error(`NativeType(${nativeType}) does match the design type "${designType?.name}"`)
  }
}

const guardPointerType = (pointerTypeList: PointerType[]) => (designType: ReflectedDesignType) => {
  let pointerType: PointerType
  if (pointerTypeList.length > 0) {
    pointerType = pointerTypeList[pointerTypeList.length - 1]!
  } else {
    /**
     * Huan(202107): NativePointer allow raw pointer (`null` as well)
     */
    pointerType = 'Pointer'
  }

  if (!designTypesCompatibleTable.has(designType)) {
    throw new Error(`Unsupported designType: ${(typeof designType)} ${(designType && designType.name)} ${designType}`)
  }

  const typeList = designTypesCompatibleTable.get(designType)
  if (!typeList) {
    throw new Error('pointerType can not found from designToPointerTypeTable[' + designType + ']')
  }
  // console.log(typeList)
  const [_, compatiblePointerTypeList] = typeList

  /**
   * Huan(202106): why `typeList.length > 0`?
   *  nativeTypeList will be empty for the designType `Promise`
   *  because the TypeScript metadata do not support to get the value inside the `Promise<value>`
   *  so we will not be able to check them.
   */
  // [] means allow all
  if (compatiblePointerTypeList.length > 0 && !compatiblePointerTypeList.includes(pointerType)) {
    throw new Error(`PointerType(${pointerType}) does match the design type "${designType?.name}"`)
  }
}

export {
  guardNativeType,
  guardPointerType,
}
