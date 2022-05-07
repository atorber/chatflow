import type {
  Constructor,
}                       from 'clone-class'
import type {
  FileBox,
}                       from './file-box.js'

interface FileBoxInterface {
  type      : FileBox['type']

  name      : FileBox['name']
  mediaType : FileBox['mediaType']
  size      : FileBox['size']
  metadata  : FileBox['metadata']

  // version: any
  // ready: any
  // syncRemote: any
  // transformBufferToStream: any
  // transformBase64ToStream: any
  // transformFileToStream: any
  // ransformUrlToStream: any
  // transformQRCodeToStream: any
  // transformUrlToStream: any

  toBase64  : FileBox['toBase64']
  toBuffer  : FileBox['toBuffer']
  toDataURL : FileBox['toDataURL']
  toFile    : FileBox['toFile']
  toJSON    : FileBox['toJSON']
  toQRCode  : FileBox['toQRCode']
  toStream  : FileBox['toStream']
  toUuid    : FileBox['toUuid']

  pipe: FileBox['pipe']
}

/**
 * Huan(202110): TODO support static methods after TypeScript 4.5: fromXXX()
 */
type FileBoxConstructor = Constructor<FileBoxInterface>

export type {
  FileBoxInterface,
  FileBoxConstructor,
}
