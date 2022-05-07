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
}                         from './backend-config.js'

class StorageNop extends StorageBackend {

  constructor (
    name    : string,
    options : StorageBackendOptions,
  ) {
    log.verbose('StorageNop', 'constructor(%s, ...)', name)
    super(name, options)
  }

  override toString (): string {
    const text = [
      this.constructor.name,
      '<nop>',
    ].join('')
    return text
  }

  public async load (): Promise<MemoryCardPayload> {
    log.verbose('StorageNop', 'load()')
    return {}
  }

  public async save (_ /* payload */ : MemoryCardPayload): Promise<void> {
    log.verbose('StorageNop', 'save()')
  }

  public async destroy (): Promise<void> {
    log.verbose('StorageNop', 'destroy()')
  }

}

export default StorageNop
export {
  StorageNop,
}
