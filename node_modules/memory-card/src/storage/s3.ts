import AWS_SDK from 'aws-sdk'
import {
  log,
}                     from '../config.js'
import type {
  MemoryCardPayload,
}                     from '../types.js'

import {
  StorageBackend,
}                         from './backend.js'
import type {
  StorageBackendOptions,
  StorageS3Options,
}                         from './backend-config.js'

const { S3 } = AWS_SDK

class StorageS3 extends StorageBackend {

  private s3: InstanceType<typeof S3>

  constructor (
    name    : string,
    options : StorageBackendOptions,
  ) {
    log.verbose('StorageS3', 'constructor()')

    options.type = 's3'
    super(name, options)
    options = options as StorageS3Options

    this.s3 = new S3({
      credentials: {
        accessKeyId     : options.accessKeyId,
        secretAccessKey : options.secretAccessKey,
      },
      region: options.region,
    })
  }

  override toString (): string {
    const text = [
      this.constructor.name,
      '<',
      this.name,
      '>',
    ].join('')
    return text
  }

  public async save (payload: MemoryCardPayload): Promise<void> {
    log.verbose('StorageS3', 'save()')

    const options = this.options as StorageS3Options

    await this.s3.putObject({
      Body   : JSON.stringify(payload),
      Bucket : options.bucket,
      Key    : this.name,
    }).promise()
  }

  public async load (): Promise<MemoryCardPayload> {
    log.verbose('StorageS3', 'load()')

    const options = this.options as StorageS3Options

    try {
      const result = await this.s3.getObject({
        Bucket : options.bucket,
        Key    : this.name,
      }).promise()

      if (!result.Body) {
        return {}
      }

      return JSON.parse(result.Body.toString())

    } catch (e: any) {
      if (/^4/.test(e.statusCode)) {
        return {}
      }
      throw e
    }

  }

  public async destroy (): Promise<void> {
    log.verbose('StorageS3', 'destroy()')

    const options = this.options as StorageS3Options

    await this.s3.deleteObject({
      Bucket : options.bucket,
      Key    : this.name,
    }).promise()
  }

}

export default StorageS3
export {
  StorageS3,
}
