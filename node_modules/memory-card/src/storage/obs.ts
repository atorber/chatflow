/// <reference path="./types.d.ts" />
import ObsClient from 'esdk-obs-nodejs'

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
  StorageObsOptions,
}                         from './backend-config.js'

class StorageObs extends StorageBackend {

  private obs: any

  constructor (
    name    : string,
    options : StorageBackendOptions,
  ) {
    log.verbose('StorageObs', 'constructor()')

    options.type = 'obs'
    super(name, options)
    options = options as StorageObsOptions

    this.obs = new ObsClient({
      access_key_id        : options.accessKeyId,
      secret_access_key    : options.secretAccessKey,
      server               : options.server,
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
    log.verbose('StorageObs', 'save()')

    const options = this.options as StorageObsOptions

    await this.putObject({
      Body   : JSON.stringify(payload),
      Bucket : options.bucket,
      Key    : this.name,
    })
  }

  public async load (): Promise<MemoryCardPayload> {
    log.verbose('StorageObs', 'load()')

    try {
      const result = await this.getObject()

      if (!result) {
        return {}
      }
      log.info('presss', result)
      return result
    } catch (e) {
      log.warn('StorageObs', 'load() exception: %s', e)
      return {}
    }

  }

  public async destroy (): Promise<void> {
    log.verbose('StorageObs', 'destroy()')

    await this.deleteObject()
  }

  private async putObject (payload: MemoryCardPayload): Promise<void> {
    const options = this.options as StorageObsOptions
    return new Promise((resolve, reject) => {
      this.obs.putObject({
        Body        : JSON.stringify(payload),
        Bucket      : options.bucket,
        Key         : this.name,
      }, (err: null | Error, result: {
        CommonMsg: {
          Status      : number,
          Code        : string,
          Message     : string,
          HostId      : string,
          RequestId   : string,
        },
        InterfaceResult: {
          ContentLength   : string,
          Date            : Date,
          RequestId       : string,
          Id2             : string,
          ETag            : string,
        },
      }) => {
        if (err) {
          reject(err)
        } else {
          log.verbose('obs putObject result', JSON.stringify(result))
          if (result.CommonMsg.Status === 200) {
            resolve()
          } else {
            reject(new Error('obs putObject error'))
          }
        }
      })
    })
  }

  private async getObject (): Promise<MemoryCardPayload | null> {
    const options = this.options as StorageObsOptions
    return new Promise((resolve, reject) => {
      this.obs.getObject({
        Bucket: options.bucket,
        Key: this.name,
      }, (err: null | Error, result: {
        CommonMsg: {
          Status        : number,
          Code          : string,
          Message       : string,
          HostId        : string,
          RequestId     : string,
        },
        InterfaceResult?: {
          ContentLength   : string,
          Date            : Date,
          RequestId       : string,
          Id2             : string,
          ETag            : string,
          ContentType     : string,
          LastModified    : Date,
          Content         : Buffer,
        },
      }) => {
        if (err) {
          reject(err)
        } else {
          log.verbose('obs getObject result', JSON.stringify(result.CommonMsg))
          if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
            const buffer = result.InterfaceResult.Content
            const str = buffer.toString()
            const obj = JSON.parse(str)
            resolve((JSON.parse(obj.Body)) as MemoryCardPayload)
          } else {
            reject(new Error('obs getObject error'))
          }
        }
      })
    })
  }

  private async deleteObject (): Promise<void> {
    const options = this.options as StorageObsOptions
    return new Promise((resolve, reject) => {
      this.obs.putObject({
        Bucket: options.bucket,
        Key: this.name,
      }, (err: null | Error, result: {
        CommonMsg: {
          Status    : number,
          Code      : string,
          Message   : string,
          HostId    : string,
          RequestId : string,
        },
        InterfaceResult: {
          Date          : Date,
          RequestId     : string,
          Id2           : string,
        },
      }) => {
        if (err) {
          reject(err)
        } else {
          log.verbose('obs putObject result', JSON.stringify(result))
          if (result.CommonMsg.Status < 300) {
            resolve()
          } else {
            reject(new Error('obs deleteObject error'))
          }
        }
      })
    })
  }

}

export default StorageObs
export {
  StorageObs,
}
