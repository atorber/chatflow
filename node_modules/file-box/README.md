# file-box

[![NPM Version](https://badge.fury.io/js/file-box.svg)](https://badge.fury.io/js/file-box)
[![NPM](https://github.com/huan/file-box/workflows/NPM/badge.svg)](https://github.com/huan/file-box/actions?query=workflow%3ANPM)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

FileBox is a virtual container for packing a file data into it for future read, and easily transport between servers with the least payload, no mater than where it is (local path, remote url, or cloud storage).

![File Box](https://huan.github.io/file-box/images/file-box-logo.jpg)

Currently the FileBox supports almost all kinds of the data input/output methods/formats:

| File Type | Pack Method | Unpack Method | Description |
| :--- | :--- | :--- | :--- |
| Local File | `fromFile()` | `toFile()` | Local file in file system |
| Remote URL | `fromUrl()` | `toUrl()`(TBW) | Remote file in a HTTP/HTTPS URL |
| Buffer | `fromBuffer()` | `toBuffer()` | JavaScript Buffer |
| Stream | `fromStream()` | `toStream()` | JavaScript Stream |
| Base64 | `fromBase64()` | `toBase64()` | Base64 data |
| DataURL | `fromDataURL()` | `toDataURL()` | DataURL data |
| QRCode | `fromQRCode()` | `toQRCode()` | QR Code Image Decode/Encode |
| UUID | `fromUuid()` | `toUuid()` | UUID by loader/saver helper functions |
| JSON | `fromJSON()` | `toJSON()` | Serialize/Deserialize FileBox |

## Examples

The following example demos:

1. Save URL to File
1. Convert Buffer to Stream
1. Pack from Base64 then Unpack to DataURL

```ts
import { FileBox } from 'file-box'

/**
 * 1. Save URL to File
 */
const fileBox1 = FileBox.fromUrl(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
  'logo.jpg',
)
fileBox1.toFile('/tmp/file-box-logo.jpg')

/**
 * 2. Convert Buffer to Stream
 */
import fs from 'fs'
const fileBox2 = FileBox.fromBuffer(
  Buffer.from('world'),
  'hello.txt',
)
const writeStream = fs.createWriteStream('/tmp/hello.txt')
fileBox2.pipe(writeStream)

/**
 * 3. Pack Base64, Unpack to DataURL
 */
const fileBox3 = FileBox.fromBase64('d29ybGQK', 'hello.txt')
fileBox3.toDataURL()
        .then(console.log)
// Output: data:text/plain;base64,d29ybGQK
```

## Known Issues

1. TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters [#56](https://github.com/huan/file-box/issues/56)

## API Reference

[API docs on Paka](https://paka.dev/npm/file-box)

### 1. Load File in to Box

#### 1.1 `fromFile(filePath: string): FileBox`

Alias: `fromLocal()`

```ts
const fileBox = FileBox.fromLocal('/tmp/test.txt')
```

#### 1.2 `fromUrl(url: string, name?: string, headers?: http.OutgoingHttpHeaders): FileBox`

Alias: `fromRemote()`

```ts
const fileBox = FileBox.fromUrl(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
  'logo.jpg',
)
```

#### 1.3 `fromStream(stream: Readable, name: string): FileBox`

```ts
const fileBox = FileBox.fromStream(res, '/tmp/download.zip')
```

#### 1.4 `fromBuffer(buffer: Buffer, name: string): FileBox`

```ts
const fileBox = FileBox.fromBuffer(buf, '/tmp/download.zip')
```

#### 1.5 `FileBox.fromBase64(base64: string, name: string): FileBox`

Decoded a base64 encoded file data.

```ts
const fileBox = FileBox.fromBase64('d29ybGQK', 'hello.txt')
fileBox.toFile()
```

#### 1.6 `FileBox.fromDataURL(dataUrl: string, name: string): FileBox`

Decoded a DataURL data.

```ts
const fileBox = FileBox.fromDataURL('data:text/plain;base64,d29ybGQK', 'hello.txt')
fileBox.toFile()
```

#### 1.7 `FileBox.fromJSON()`

Restore a `FileBox.toJSON()` text string back to a FileBox instance.

```ts
const restoredFileBox = FileBox.fromJSON(jsonText)
```

#### 1.8 `FileBox.fromQRCode(qrCodeValue: string)`

Get a FileBox instance that represent a QR Code value.

```ts
const fileBox = FileBox.fromQRCode('https://github.com')
fileBox.toFile('qrcode.png')
```

#### 1.9 `FileBox.fromUuid(uuid: string)`

Load a FileBox from a UUID.

See: `FileBox.setUuidLoader()`

### 2. Get File out from Box

### 2.1 `toFile(name?: string): Promise<void>`

Save file to current work path(cwd) of the local file system with the default `name`.

if `name` specified with a full path, then will use the speficied file name instead.

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
await fileBox.toFile('/tmp/logo.jpg')
```

#### 2.2 `toStream(): Readable`

Get the stream of file data.

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
const readableStream = fileBox.toStream()
```

#### 2.3 `pipe(destination: Writable): Promise<void>`

Pipe to a writable stream.

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
const writableStream = fs.createWritable('/tmp/logo.jpg')
fileBox.pipe(writableStream)
```

#### 2.4 `toBase64(): Promise<string>`

Get the base64 data of file.

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
const base64Text = await fileBox.toBase64()
console.log(base64Text) // Output: the base64 encoded data of the file
```

#### 2.5 `toJSON(): string`

Get the `JSON.stringify`-ed text.

**Not Implement Yet: Working In Progress...**

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
const jsonText1 = fileBox.toJSON()
const jsonText2 = JSON.stringify(fileBox)
assert(jsonText1 === jsonText2)

console.log(jsonText1) // Output: the stringified data of the fileBox

const restoredFileBox = fileBox.fromJSON(jsonText1)
restoredFileBox.toFile('/tmp/file-box-logo.jpg')
```

#### 2.6 `toDataURL(): Promise<string>`

Get the DataURL of the file.

```ts
const fileBox = FileBox.fromFile('tests/fixtures/hello.txt')
const dataUrl = await fileBox.toDataURL()
console.log(dataUrl) // Output: data:text/plain;base64,d29ybGQK'
```

#### 2.7 `toBuffer(): Promise<Buffer>`

Get the Buffer of the file.

```ts
const fileBox = FileBox.fromFile('tests/fixtures/hello.txt')
const buffer = await fileBox.toBuffer()
console.log(buffer.toString()) // Output: world
```

#### 2.8 `toQRCode(): Promise<string>`

Decode the QR Code value from the file.

```ts
const fileBox = FileBox.fromFile('qrcode.jpg')
const qrCodeValue = await fileBox.toQRCode()
console.log(`QR Code decoded value is: "${qrCodeValue}"`)
// Output: QR Code decoded value is: "https://github.com"
```

#### 2.9 `toUuid(): Promise<string>`

Save the FileBox to a UUID file and return the UUID.

See: `FileBox.setUuidSaver()`

#### 2.10 `toJSON(): string`

Encode a FileBox instance to JSON string so that we can transfer the FileBox on the wire.

```ts
const fileBox = FileBox.fromBase64('RmlsZUJveEJhc2U2NAo=')

const jsonText = JSON.stringify(fileBox)
// the above code equals to the following line of code:
// const jsonText = fileBox.toJSON()

// we will get the serialized data for this FileBox:
console.log(jsonText)
// Output: {"name":"qrcode.png","metadata":{},"boxType":1,"base64":"RmlsZUJveEJhc2U2NAo="}

// restore our fleBox:
// const newFileBox = FileBox.fromJSON(jsonText)
```

##### Limitation

Because we want to enable the `JSON.stringify(fileBox)`, which will call `fileBox.toJSON()`, so the `toJSON()` can not be `async`, which means we can only support limited FileBoxType(s):

1. FileBoxType.Base64
1. FileBoxType.Url
1. FileBoxType.QRCode

For other types like `FileBoxType.File`, `FileBoxType.Buffer`, `FileBoxType.Stream`, etc, we need to transform them to `FileBoxType.Base64` before we call `toJSON`:

```ts
const fileBoxLazy = FileBox.fromFile('./test.txt')
const base64 = await fileBoxLazy.toBase64()

const fileBox = FileBox.fromBase64(base64, 'test.txt')
// fileBox will be serializable because it do not need async operations

const jsonText = JSON.stringify(fileBox)
console.log(jsonText)
```

### 3. Misc

#### 3.1 `name`

File name of the file in the box

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
console.log(fileBox.name) // Output: file-box-logo.jpg
```

#### 3.2 `metadata: Metadata { [key: string]: any }`

Metadata for the file in the box. This value can only be assigned once, and will be immutable afterwards, all following assign or modify actions on `metadata` will throw errors

```ts
const fileBox = FileBox.fromRemote(
  'https://huan.github.io/file-box/images/file-box-logo.jpg',
)
fileBox.metadata = {
  author      : 'huan',
  githubRepo  : 'https://github.com/huan/file-box',
}

console.log(fileBox.metadata)       // Output: { author: 'huan', githubRepo: 'https://github.com/huan/file-box' }
fileBox.metadata.author = 'Tank'  // Will throw exception
```

#### 3.3 `version(): string`

Version of the FileBox

#### 3.4 `toJSON(): string`

Serialize FileBox metadata to JSON.

#### 3.5 `ready(): Promise<void>`

Update the necessary internal data and make everything ready for use.

#### 3.6 `syncRemoteName(): Promise<void>`

Sync the filename with the HTTP Response Header

HTTP Header Example:
> Content-Disposition: attachment; filename="filename.ext"

#### 3.7 `type: FileBoxType`

Return the type of the current FileBox instance.

The currently supported types are defined at [file-box-type.ts](https://github.com/huan/file-box/blob/master/src/file-box.type.ts#L15) as the following demonstrated:

```ts
enum FileBoxType {
  Unknown = 0,
  Base64  = 1,
  Url     = 2,
  QRCode  = 3,
  Buffer  = 4,
  File    = 5,
  Stream  = 6,
  Uuid    = 7,
}
```

#### 3.8 `FileBox.setUuidLoader(loader: UuidLoader): void`

Required by static method `FileBox.fromUuid()`

```ts
class FileBoxUuid extends FileBox {}

const loader: UuidLoader = async (uuid: string) => {
  const stream = new PassThrough()
  stream.end('hello, world!')
  return stream
})

FileBoxUuid.setUuidLoader(loader)
const fileBox = FileBoxUuid.fromUuid('12345678-1234-1234-1234-123456789012', 'test.txt')
await fileBox.toFile('test.txt')
```

The `UuidLoader` is a function that takes a UUID and return a readable stream.

```ts
type UuidLoader = (this: FileBox, uuid: string) => Readable
```

#### 3.9 `FileBox.setUuidSaver(saver: UuidSaver): void`

Required by instance method `fileBox.toUuid()`

```ts
class FileBoxUuid extends FileBox {}

const saver: UuidSaver = async (stream: Readable) => {
  // save the stream and get uuid
  return '12345678-1234-1234-1234-123456789012'
})

FileBoxUuid.setUuidSaver(saver)

const fileBox = FileBoxUuid.fromFile('test.txt')
const uuid = await fileBox.toUuid()
```

The `UuidSaver` is a function that takes a readable stream and return a UUID promise.

```ts
type UuidSaver = (this: FileBox, stream: Readable) => Promise<string>
```

#### 3.10 `size`

The file box size in bytes. (`-1` means unknown)

It is not the size of the target (boxed) file itself.

For example:

```ts
const fileBox = FileBox.fromUrl('http://example.com/image.png')
console.log(fileBox.size)
// > 20 <- this is the length of the URL string
```

#### 3.11 `remoteSize`

The remote file size in bytes. (`-1` or `undefined` means unknown)

For example:

```ts
const fileBox = FileBox.fromUrl('http://example.com/image.png')
await fileBox.ready()
console.log(fileBox.remoteSize)
// > 102400 <- this is the size of the remote image.png
```

## Features

1. Present A File by Abstracting It's Meta Information that supports Reading & toJSON() API.
1. Follow DOM File/BLOB Interface
1. Present a file that could be: Local, Remote, Stream
1. Lazy load
1. Serializable
1. Can be Transfered from server to server, server to browser.

## SCHEMAS

### Url

[Node.js Documentation > URL Strings and URL Objects](https://nodejs.org/docs/latest/api/url.html#url_url_strings_and_url_objects)

```asciiart
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            href                                             │
├──────────┬──┬─────────────────────┬─────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │        host         │           path            │ hash  │
│          │  │                     ├──────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │   hostname   │ port │ pathname │     search     │       │
│          │  │                     │              │      │          ├─┬──────────────┤       │
│          │  │                     │              │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │   hostname   │ port │          │                │       │
│          │  │          │          ├──────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │        host         │          │                │       │
├──────────┴──┼──────────┴──────────┼─────────────────────┤          │                │       │
│   origin    │                     │       origin        │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴─────────────────────┴──────────┴────────────────┴───────┤
│                                            href                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Path

[Node.js Documentation > path.parse(path)](https://nodejs.org/api/path.html#path_path_parse_path)

```asciiart
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

## History

### main v1.4 (Nov 14, 2021)

1. `fileBox.size` will be serialized to/from JSON, and present the `Content-Length` of the file. (`-1` means unknown)
1. `mimeType` has been renamed to `mediaType`, and added to the `FileBoxInterface`

### v1.0 (Oct 20, 2021)

1. Suppert ES Module. ([#54](https://github.com/huan/file-box/issues/54))
1. Add UUID boxType support: `FileBox.fromUuid()` and `FileBox.toUuid()`
1. Add `size` property to return the size of the file. (`-1` means unknown)
1. Add `remoteSize` property to present the remote size of the file (if applicable, `-1` means unknown)
1. Add `UniformResourceNameRegistry` class for providing a production-ready basic UUID management tool.
1. Add `FileBoxInterface`, `FileBox.isInstance()`, and `FileBox.isInterface()`

Breaking changes:

1. `toJSON` format renamed `boxType` to `type`
1. `type()` has been changed to `type`
1. `version()` has been changed to `version`

### v0.16 master

1. Throw error when consume a stream twice to prevent data lost. ([#50](https://github.com/huan/file-box/issues/50))

### v0.14 (Oct 2020)

1. Add `fileBox.type()` to return the `FileBoxType` of a FileBox. ([wechaty/wechaty#1918](https://github.com/wechaty/wechaty/issues/1918#issuecomment-590146993))
1. Change `Readable` to `stream.Readable` for better compatibility. (Jun 27, 2020)
1. Add `chunkerTransformStream` to `toStream` ([#44](https://github.com/huan/file-box/issues/44))

### v0.12 (Feb 2020)

Add support to `JSON.stringify()` ([#25](https://github.com/huan/file-box/issues/25)):

1. `FileBox.fromJSON()` - Static method for deserialization
1. `fileBox.toJSON()` - Instance method for serialization

### v0.10 (Jan 2020)

1. Add support to QR Code: `FileBox.fromQRCode()` and `FileBox.toQRCode()`
1. Start using @chatie/tsconfig

### v0.8 (Jun 2018)

1. Add two new factory methods: `fromBase64()`, `fromDataURL()`
1. Add `toBuffer()`, `toBase64()` and `toDataURL()` to get the Buffer and BASE64 encoded file data
1. Add `metadata` property to store additional information. ([#3](https://github.com/huan/file-box/issues/3))

### v0.4 (May 2018)

1. Add `headers` option for `fromRemote()` method

### v0.2 (Apr 2018)

Initial version.

## See Also

* [File API - W3C Working Draft, 26 October 2017](https://www.w3.org/TR/FileAPI/)
* [MIME Sniffing - Living Standard — Last Updated 20 April 2018](https://mimesniff.spec.whatwg.org/#parsable-mime-type)
* [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)
* [Web technology for developers > Web APIs > File](https://developer.mozilla.org/en-US/docs/Web/API/File)
* [Web technology for developers > Web APIs > Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
* [Web technology for developers > Web APIs > FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
* [A simple HTTP Request & Response Service.](https://httpbin.org)
* [Hurl.it — Make HTTP Requests](https://www.hurl.it)

## Thanks

This module is inspired by <https://github.com/gulpjs/vinyl> and <https://github.com/DefinitelyTyped/DefinitelyTyped/pull/12368> when I need a virtual File module for my [Chatie](https://github.com/Chatie) project.

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), Microsoft AI MVP, zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Docs released under Creative Commons
* Code released under the Apache-2.0 License
* Code & Docs © 2018 Huan LI \<zixia@zixia.net\>
