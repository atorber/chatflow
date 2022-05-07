#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import 'reflect-metadata'

import assert   from 'assert'
import {
  PassThrough,
  Readable,
}               from 'stream'
import {
  test,
  sinon,
}               from 'tstest'

import { FileBox }      from './file-box.js'
import { FileBoxType }  from './file-box.type.js'

const requiredMetadataKey = Symbol('required')

const tstest = {
  classFixture () {
    return (constructor: Function) => {
      console.info(constructor.name)
      console.info(constructor.prototype.name)
    }
  },
  methodFixture () {
    return (
      ..._: any[]
      // target      : Object,
      // propertyKey : string,
      // descriptor  : PropertyDescriptor,
    ) => {
      console.info('@fixture()')
    }
  },
  parameterFixture () {
    return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
      console.info(propertyKey)
      const existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || []
      existingRequiredParameters.push(parameterIndex)
      Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey)
    }
  },
}

test('File smoke testing', async t => {
  t.throws(() => FileBox.fromFile('x'), 'should throw for a non-existing file')
})

@tstest.classFixture()
export class FixtureFileBox {

  @tstest.methodFixture()
  public static localFileFixture () {
    return {
      content: 'T',
      name: 'test.txt',
      size: '1',
      type: 'plain/text',
    }
  }

}

// tslint:disable:max-classes-per-file

export class TestFileBox {

  public static testFileCreateLocal (
    @tstest.parameterFixture() localFileFixture: any,
  ) {
    const file = FileBox.fromFile(localFileFixture)

    test('File.createLocal()', async t => {
      t.ok(file, 'ok')

    })

    test('File.fromRemote()', async t => {
      const URL = 'http://httpbin.org/response-headers?Content-Type=text/plain;%20charset=UTF-8&Content-Disposition=attachment;%20filename%3d%22test.json%22'
      assert(URL)
      t.pass('ok')
    })

  }

}

test('toBase64()', async t => {
  const BASE64_DECODED = 'FileBoxBase64\n'
  const BASE64_ENCODED = 'RmlsZUJveEJhc2U2NAo='

  const fileBox = FileBox.fromBase64(BASE64_ENCODED, 'test.txt')
  const base64 = await fileBox.toBase64()

  t.equal(base64, BASE64_ENCODED, 'should get base64 back')

  const text = Buffer.from(base64, 'base64').toString()
  t.equal(text, BASE64_DECODED, 'should get the text right')
})

test('fromBuffer() & toBase64()', async t => {
  const BASE64_ENCODED = 'RmlsZUJveEJhc2U2NAo='

  const buffer = Buffer.from(BASE64_ENCODED, 'base64')
  const fileBox = FileBox.fromBuffer(buffer, 'test.txt')
  const base64 = await fileBox.toBase64()

  t.equal(base64, BASE64_ENCODED, 'should get base64 back from buffer')
})

test('syncRemote()', async t => {
  class FileBoxTest extends FileBox {

    static override fromUrl (...args: any[]): FileBoxTest { return (super.fromUrl as any)(...args) }
    override _syncUrlMetadata () { return super._syncUrlMetadata() }

  }

  const URL = 'http://httpbin.org/response-headers?Content-Disposition=attachment;%20filename%3d%22test.txt%22&filename=test.txt'

  const EXPECTED_NAME_FROM_URL    = 'response-headers'
  const EXPECTED_TYPE_FROM_URL    = 'application/unknown'

  const EXPECTED_NAME_FROM_HEADER = 'test.txt'
  const EXPECTED_SIZE_FROM_HEADER = 159
  const EXPECTED_TYPE_FROM_HEADER = 'application/json'

  const fileBox = FileBoxTest.fromUrl(URL)

  t.equal(fileBox.name, EXPECTED_NAME_FROM_URL, 'should get the name from url')
  t.equal(fileBox.mediaType, EXPECTED_TYPE_FROM_URL, 'should get the mime type from url')

  await fileBox._syncUrlMetadata()

  t.equal(fileBox.size,       EXPECTED_SIZE_FROM_HEADER,  'should get the size from remote header')
  t.equal(fileBox.name,       EXPECTED_NAME_FROM_HEADER,  'should get the name from remote header')
  t.equal(fileBox.mediaType,  EXPECTED_TYPE_FROM_HEADER,  'should get the mime type from remote http header')
})

test('fromURL() deal with url with querystring', async t => {
  const URL = 'https://zixia.net/a.jpg?name=value&t=1324'
  const EXPECTED_NAME = 'a.jpg'

  const fileBox = FileBox.fromUrl(URL)
  t.equal(fileBox.name, EXPECTED_NAME, 'should get basename from url with querystring')
})

test('toDataURL()', async t => {
  const FILE_PATH         = 'tests/fixtures/data.bin'
  const EXPECTED_DATA_URL = 'data:application/octet-stream;base64,dGVzdA=='

  const fileBox = FileBox.fromFile(FILE_PATH)

  const dataUrl = await fileBox.toDataURL()

  t.equal(dataUrl, EXPECTED_DATA_URL, 'should get the data url right')
})

test('toString()', async t => {
  const FILE_PATH     = 'tests/fixtures/data.bin'
  const EXPECT_STRING = 'FileBox#File<data.bin>'

  const fileBox = FileBox.fromFile(FILE_PATH)
  t.equal(fileBox.toString(), EXPECT_STRING, 'should get the toString() result')
})

test('toBuffer()', async t => {
  const FILE_PATH     = 'tests/fixtures/data.bin'
  const EXPECT_STRING = 'test'

  const fileBox = FileBox.fromFile(FILE_PATH)
  const buffer = await fileBox.toBuffer()

  t.equal(buffer.toString(), EXPECT_STRING, 'should get the toBuffer() result')
})

/**
 * Huan(202106): we keep this unit test for trying to figure out which operation system can support this long file name.
 *  See: https://github.com/huan/file-box/issues/58
 */
test('toFile() with long name', async t => {
  const IMAGE_URL = 'https://s3.cn-north-1.amazonaws.com.cn/xiaoju-material/public/5ffd393fc503f00039101dae_1620978346435_%E7%94%B5%E6%B1%A0%E5%9E%8B%E5%8F%B7%09%E8%BF%9B%E8%B4%A7%E4%BB%B7%E6%A0%BC%09%E5%8E%9F%E5%94%AE%E5%90%8E%E8%A1%A5%E6%AC%BE%E4%BB%B7%E6%A0%BC%09%E7%8E%B0%E5%85%AC%E5%8F%B8%E6%89%BF%E6%8B%85%E4%B8%80%E5%8D%8A%E7%9A%84%E4%BB%B7%E6%A0%BC%0AZD-20-100%09420%09270%09135%0AZD-Q85-D23L%09360%09270%09135%0AZD-H6-L3%09420%09315%09157.5%0A%E6%80%BB%E8%AE%A1%EF%BC%9A%091200%09855%09427.5%0A'

  const linux = {
    code    : 'ENAMETOOLONG',
    errno   : -36,
    syscall : 'open',
  }
  const darwin = {
    code    : 'ENAMETOOLONG',
    errno   : -63,
    syscall : 'open',
  }
  const win32 = {
    code    : 'ENOENT',
    errno   : -4058,
    syscall : 'open',
  }

  const FIXTURE_ERROR: {
    [key in typeof process.platform]?: Object
  } = {
    darwin,
    linux,
    win32,
  }

  const fileBox = FileBox.fromUrl(IMAGE_URL)
  await t.rejects(
    fileBox.toFile(),
    FIXTURE_ERROR[process.platform],
    `should reject toFile() with ${JSON.stringify(FIXTURE_ERROR[process.platform])}`,
  )
})

test('metadata', async t => {
  const FILE_PATH     = 'tests/fixtures/data.bin'

  const EXPECTED_NAME = 'myname'
  const EXPECTED_AGE  = 'myage'
  const EXPECTED_MOL  = 42

  // interface MetadataType {
  //   metaname : string,
  //   metaage  : number,
  //   metaobj: {
  //     mol: number,
  //   }
  // }

  const EXPECTED_METADATA = {
    metaage: EXPECTED_AGE,
    metaname: EXPECTED_NAME,
    metaobj: {
      mol: EXPECTED_MOL,
    },
  }

  const fileBox = FileBox.fromFile(FILE_PATH)

  t.same((fileBox as FileBox).metadata, {}, 'should get a empty {} if not set')

  t.doesNotThrow(
    () => {
      (fileBox as FileBox).metadata = EXPECTED_METADATA
    },
    'should not throw for set metadata for the first time',
  )

  t.throws(
    () => {
      (fileBox as FileBox).metadata = EXPECTED_METADATA
    },
    'should throw for set metadata again',
  )

  t.throws(
    () => {
      (fileBox as FileBox).metadata['mol'] = EXPECTED_MOL
    },
    'should throw for change value of a property on metadata',
  )

  t.same((fileBox as FileBox).metadata, EXPECTED_METADATA, 'should get the metadata')
})

test('fromQRCode()', async t => {
  const QRCODE_VALUE = 'hello, world!'
  const EXPECTED_QRCODE_IMAGE_BASE64 = [
    'iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKcSURBVO3BQY7',
    'cQAwEwSxC//9yeo88NSBIsx7TjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKd',
    'YoxRrl4qEk/CaVkyTcoXKShN+k8kSxRinWKMUa5eJlKm9Kwh0qn6TypiS8qVijFGuUYo1y8WFJuEPlj',
    'iR0Kl0SOpUuCZ3KHUm4Q+WTijVKsUYp1igXw6n8T4o1SrFGKdYoF8MloVOZrFijFGuUYo1y8WEq3yQJ',
    'ncoTKt+kWKMUa5RijXLxsiR8M5UuCZ3KSRK+WbFGKdYoxRrl4iGVf5nKicq/pFijFGuUYo0Sf/BAEjq',
    'VLglvUnkiCZ3KSRLepPJJxRqlWKMUa5SLlyXhROU3JaFT6ZJwonKShCeS0Kk8UaxRijVKsUaJP3hREj',
    'qVO5JwotIloVO5Iwl3qJwk4Q6VNxVrlGKNUqxRLv6yJJyodEl4Igl3qHRJ6FTuUPmkYo1SrFGKNcrFQ',
    '0k4ScITSehUuiScJKFT6ZLQqXRJuEPljiR0Kk8Ua5RijVKsUS4eUvkmSbhDpUvCHUk4UflNxRqlWKMU',
    'a5SLh5Lwm1Q6lS4JdyThCZWTJJyovKlYoxRrlGKNcvEylTcl4SQJnUqXhCdUuiScJOFvKtYoxRqlWKN',
    'cfFgS7lB5k0qXhDuS0Kl0SehUTpLQJaFTeaJYoxRrlGKNcjFcEjqVJ5JwkoROpVP5pGKNUqxRijXKxX',
    '8mCScqXRJOVE6S0Kl8UrFGKdYoxRrl4sNUPknlDpUuCV0SOpWTJHyTYo1SrFGKNcrFy5Lwm5LQqXQqX',
    'RI6lZMkdConKidJ6FTeVKxRijVKsUaJP1hjFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqx',
    'RinWKMUa5Q8Ztu740xD9iQAAAABJRU5ErkJggg==',
  ].join('')

  const fileBox = FileBox.fromQRCode(QRCODE_VALUE)
  const base64Text = await fileBox.toBase64()

  t.equal(base64Text, EXPECTED_QRCODE_IMAGE_BASE64, 'should encode QR Code value to expected image')
})

test('toQRCode()', async t => {
  const QRCODE_IMAGE_BASE64 = [
    'iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAAA',
    'CXBIWXMAAA7EAAAOxAGVKw4bAAAA7klEQVRYw+2WsQ3EIAxFjShSMgKjZLRktIzCCJQpIv7Z',
    'hCiXO/qzT/wCWXo0X3wbEw0NWVaEKM187KHW2QLZ+AhpXovfQ+J6skEWHELqBa5NEeCwR7iS',
    'V7BDzuzAiZ9eqn5IWjfWXHf7VCO5tPAM6U9AjSRideyHFn4FiuvDqV5CM9rZXuF2pZmIAjZy',
    'x4S0MDdBxEmu3TrliPf7iglPvuLlRydfU3P70UweCSK+ZYK0mUg1O4AVcv0/8itGkC7SdiTH',
    '0+Mz19oJZ4NkhhSPbIhQkQGI8u1HJzmzs7p7pzNAru2pJb6z8ykkQ0P/pheK6vjurjf7+wAA',
    'AABJRU5ErkJggg==',
  ].join('')
  const EXPECTED_QRCODE_TEXT = 'hello, world!'

  const fileBox = FileBox.fromBase64(QRCODE_IMAGE_BASE64, 'qrcode.png')
  const qrCodeValue = await fileBox.toQRCode()

  t.equal(qrCodeValue, EXPECTED_QRCODE_TEXT, 'should decode qrcode image base64 to qr code value')
})

test('toJSON()', async t => {
  // const BASE64_DECODED = 'FileBoxBase64\n'
  const BASE64_ENCODED = 'RmlsZUJveEJhc2U2NAo='
  const BASE64_FILENAME = 'test.txt'

  /**
   * Huan(202111): we have both `type` and `boxType` is because the compatible issue #73
   *  @see https://github.com/huan/file-box/issues/73
   */
  const EXPECTED_JSON_TEXT = '{"metadata":{},"name":"test.txt","size":14,"base64":"RmlsZUJveEJhc2U2NAo=","type":1,"boxType":1}'

  const fileBox = FileBox.fromBase64(BASE64_ENCODED, BASE64_FILENAME)
  const jsonText = JSON.stringify(fileBox)

  t.equal(jsonText, EXPECTED_JSON_TEXT, 'should get expected json text')

  const newFileBox = FileBox.fromJSON(jsonText)
  const newBase64 = await newFileBox.toBase64()

  t.equal(newBase64, BASE64_ENCODED, 'should get base64 back')
})

test('toJSON() for not supported type', async t => {
  const BASE64_ENCODED = 'RmlsZUJveEJhc2U2NAo='

  const buffer = Buffer.from(BASE64_ENCODED, 'base64')
  const fileBox = FileBox.fromBuffer(buffer, 'test.txt')

  t.equal(fileBox.type, FileBoxType.Buffer, 'should get type() as Buffer')
  t.throws(() => JSON.stringify(fileBox), 'should throw for buffer type of FileBox')
})

/**
 * Issue #50: Stream can not be consumed twice
 *  https://github.com/huan/file-box/issues/50
 */
test('toStream() twice for a stream', async t => {
  const stream = new PassThrough()
  const box    = FileBox.fromStream(stream, 'hello.dat')

  stream.end('hello, world!')

  // consume it
  await t.resolves(box.toBase64(), 'should successful to read the stream for the first time')

  // consume it twice
  await t.rejects(box.toBuffer(), 'should throw when the file-box be consumed twice')
})

test('toUuid()', async t => {
  const BASE64_ENCODED = 'RmlsZUJveEJhc2U2NAo='
  const UUID = '12345678-1234-1234-1234-123456789012'

  class FileBoxTest extends FileBox {}

  const buffer = Buffer.from(BASE64_ENCODED, 'base64')
  const fileBox = FileBoxTest.fromBuffer(buffer, 'test.txt')

  await t.rejects(fileBox.toUuid(), 'should reject without `FileBox.setUuidSaver()` call`')

  FileBoxTest.setUuidSaver(() => Promise.resolve(UUID))
  t.equal(await fileBox.toUuid(), UUID, `should get UUID: ${UUID}`)
})

test('fromUuid()', async t => {
  const UUID = '12345678-1234-1234-1234-123456789012'
  const TEXT = 'hello, world!'

  class FileBoxTest extends FileBox {}

  const stream = new PassThrough()
  stream.end(TEXT)

  const uuidBox = FileBoxTest.fromUuid(UUID, 'test.txt')

  await t.rejects(uuidBox.toBase64(), 'should reject without `FileBox.setUuidLoader()` call`')

  FileBoxTest.setUuidLoader((_: string) => Promise.resolve(stream))
  t.equal((await uuidBox.toBuffer()).toString(), TEXT, `should get BASE64: ${TEXT}`)
})

test('setUuidLoader()', async t => {
  class FileBoxTest1 extends FileBox {}
  class FileBoxTest2 extends FileBox {}

  t.doesNotThrow(() => FileBoxTest1.setUuidLoader((_: string) => ({} as any)), 'should not throw for set loader for the first time')
  t.throws(() => FileBoxTest1.setUuidLoader((_: string) => ({} as any)), 'should throw for set loader twice')

  t.doesNotThrow(() => FileBoxTest2.setUuidLoader((_: string) => ({} as any)), 'should not throw for set loader for the first time')
  t.throws(() => FileBoxTest2.setUuidLoader((_: string) => ({} as any)), 'should throw for set loader twice')
})

test('setUuidSaver()', async t => {
  class FileBoxTest1 extends FileBox {}
  class FileBoxTest2 extends FileBox {}

  t.doesNotThrow(() => FileBoxTest1.setUuidSaver((_: Readable) => Promise.resolve('uuid')), 'should not throw for set loader for the first time')
  t.throws(() => FileBoxTest1.setUuidSaver((_: Readable) => Promise.resolve('uuid')), 'should throw for set loader twice')

  t.doesNotThrow(() => FileBoxTest2.setUuidSaver((_: Readable) => Promise.resolve('uuid')), 'should not throw for set loader for the first time')
  t.throws(() => FileBoxTest2.setUuidSaver((_: Readable) => Promise.resolve('uuid')), 'should throw for set loader twice')
})

test('setUuidLoader() & setUuidSsaver() with `this`', async t => {
  const sandbox = sinon.createSandbox()

  const loader  = sandbox.stub()
    .returns(await FileBox.fromQRCode('qr').toStream())
  const saver   = sandbox.stub()
    .returns('uuid')

  class FileBoxTest extends FileBox {}

  FileBoxTest.setUuidLoader(loader)
  FileBoxTest.setUuidSaver(saver)

  const fileBox = FileBoxTest.fromUuid('uuid', 'test.txt')
  await fileBox.toBuffer()
  t.equal(loader.thisValues[0], fileBox, 'should call loader with `this`')

  const fileBox2 = FileBoxTest.fromBuffer(Buffer.from('test'), 'test.txt')
  await fileBox2.toUuid()
  t.equal(saver.thisValues[0], fileBox2, 'should call saver with `this`')
})

test('FileBox.validInterface()', async t => {
  const fileBox = FileBox.fromQRCode('test')
  /**
   * 2 OK
   */
  t.ok(FileBox.validInstance(fileBox), 'should satisfy instance validation for a FileBox instance')
  t.ok(FileBox.validInterface(fileBox), 'should satisfy interface validation for a FileBox instance')
  t.ok(FileBox.valid(fileBox), 'should satisfy interface validation')
  t.ok(fileBox instanceof FileBox, 'should be instance of FileBox')

  const copy = {} as any
  Object.getOwnPropertyNames(
    Object.getPrototypeOf(fileBox),
  ).forEach(prop => {
    copy[prop] = (fileBox as FileBox)[prop as keyof FileBox]
  })

  function NOT_FILE_BOX_CONSTRUCTOR () {}
  const target = {
    ...copy,
    constructor: NOT_FILE_BOX_CONSTRUCTOR,
  }

  /**
   * 1 OK, 1 NG
   */
  t.ok(FileBox.validInstance(target), 'should pass instance validation instance test')
  t.ok(FileBox.validInterface(target), 'should pass interface validation for an object with FileBox properties')
  t.ok(FileBox.valid(target), 'should satisfy interface validation')
  t.ok(target instanceof FileBox, 'should be instance of FileBox')

  /**
   * 2 NG
   */
  delete target.size
  t.notOk(FileBox.validInterface(target), 'should not be a valid interface if it lack any property')
  t.notOk(FileBox.valid(target), 'should not satisfy interface validation')
})
