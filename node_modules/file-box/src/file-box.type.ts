import type http    from 'http'
import type {
  Readable,
  Writable,
}                   from 'stream'

import type {
  FileBox,
}                 from './file-box.js'

interface Pipeable {
  // pipe: typeof Readable.prototype.pipe,
  pipe<T extends Writable>(destination: T, options?: { end?: boolean; }): T;
}

/**
 * Huan(202002):
 *  We need to keep this enum number to be consistent
 *  because of toJSON & fromJSON need the same type number across versoins.
 *  and gRPC maybe will use those numbers in the future as well.
 */
enum FileBoxType {
  Unknown = 0,

  /**
   * 1. toJSON() Serializable
   *  - Base64
   *  - Url
   *  - QRCode
   *  - UUID
   *
   * 2. toJSON() NOT Serializable: need to convert to FileBoxType.Base64 before call toJSON()
   *  - Buffer
   *  - Stream
   *  - File
   */
  Base64  = 1,
  Url     = 2,
  QRCode  = 3,

  Buffer  = 4,
  File    = 5,
  Stream  = 6,
  Uuid    = 7,
}

interface Metadata {
  [key: string]: any,
}

/**
 * URI to the file
 * See:
 *  https://nodejs.org/api/fs.html#fs_url_object_support
 *  https://danielmiessler.com/study/url-uri/
 *
 * FileType: LOCAL, REMOTE, BUFFER, STREAM
 *
 */
interface FileBoxOptionsCommon {
  /**
   * File base name: name + ext
   *  like: "file.txt"
   */
  name: string

  /**
   * Can be only set once
   */
  metadata?: Metadata,

  /**
   * Size
   */
  size?: number
}

interface FileBoxOptionsFile {
  type : FileBoxType.File
  path : string
}
interface FileBoxOptionsUrl {
  type     : FileBoxType.Url
  url      : string
  headers? : http.OutgoingHttpHeaders
}
interface FileBoxOptionsBuffer {
  type   : FileBoxType.Buffer
  buffer : Buffer
}
interface FileBoxOptionsStream {
  type   : FileBoxType.Stream
  stream : Readable
}
interface FileBoxOptionsQRCode {
  type   : FileBoxType.QRCode,
  qrCode : string,
}
interface FileBoxOptionsBase64 {
  type   : FileBoxType.Base64,
  base64 : string,
}
interface FileBoxOptionsUuid {
  type : FileBoxType.Uuid
  uuid : string,
}

type FileBoxOptions = FileBoxOptionsCommon & (
    never
  | FileBoxOptionsBase64
  | FileBoxOptionsBuffer
  | FileBoxOptionsFile
  | FileBoxOptionsQRCode
  | FileBoxOptionsStream
  | FileBoxOptionsUrl
  | FileBoxOptionsUuid
)

type FileBoxJsonObject =  FileBoxOptionsCommon & (
  | FileBoxOptionsBase64
  | FileBoxOptionsUrl
  | FileBoxOptionsQRCode
  | FileBoxOptionsUuid
)

type UuidLoader = (this: FileBox, uuid: string)      => Promise<Readable>
type UuidSaver  = (this: FileBox, stream: Readable)  => Promise<string>

export type {
  FileBoxJsonObject,
  FileBoxOptions,
  FileBoxOptionsBase64,
  FileBoxOptionsCommon,
  FileBoxOptionsQRCode,
  FileBoxOptionsUrl,
  FileBoxOptionsUuid,
  Metadata,
  Pipeable,
  UuidSaver,
  UuidLoader,
}
export {
  FileBoxType,
}
