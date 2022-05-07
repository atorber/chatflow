import fs   from 'fs'
import path from 'path'

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
  StorageFileOptions,
}                         from './backend-config.js'

class StorageFile extends StorageBackend {

  private readonly absFileName: string

  constructor (
    name    : string,
    options : StorageBackendOptions,
  ) {
    log.verbose('StorageFile', 'constructor(%s, ...)', name)

    options.type = 'file'
    super(name, options)

    options = options as StorageFileOptions

    this.absFileName = path.isAbsolute(this.name)
      ? this.name
      : path.resolve(
        process.cwd(),
        this.name,
      )
    if (!/\.memory-card\.json$/.test(this.absFileName)) {
      this.absFileName +=  '.memory-card.json'
    }
  }

  override toString (): string {
    const text = [
      this.constructor.name,
      '<',
      this.absFileName,
      '>',
    ].join('')
    return text
  }

  public async load (): Promise<MemoryCardPayload> {
    log.verbose('StorageFile', 'load() from %s', this.absFileName)

    if (!fs.existsSync(this.absFileName)) {
      log.verbose('MemoryCard', 'load() file not exist, NOOP')
      return {}
    }

    const buffer = await new Promise<Buffer>((resolve, reject) => fs.readFile(this.absFileName, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf)
      }
    }))
    const text = buffer.toString()

    let payload: MemoryCardPayload = {}

    try {
      payload = JSON.parse(text)
    } catch (e) {
      log.error('MemoryCard', 'load() exception: %s', e)
    }
    return payload
  }

  public async save (payload: MemoryCardPayload): Promise<void> {
    log.verbose('StorageFile', 'save() to %s', this.absFileName)

    const text = JSON.stringify(payload)
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(
        this.absFileName,
        text,
        err => err ? reject(err) : resolve(),
      )
    })
  }

  public async destroy (): Promise<void> {
    log.verbose('StorageFile', 'destroy()')

    if (fs.existsSync(this.absFileName)) {
      fs.unlinkSync(this.absFileName)
    }
  }

}

export default StorageFile
export {
  StorageFile,
}
