import {
  log,
}                         from '../config.js'

import {
  BACKEND_FACTORY_DICT,
  StorageBackendOptions,
}                         from './backend-config.js'

import type {
  StorageBackend,
}                         from './backend.js'

async function getStorage (
  name?   : string,
  options : StorageBackendOptions = {
    type: 'file',
  },
): Promise<StorageBackend> {
  log.verbose('getStorage', 'name: %s, options: %s', name, JSON.stringify(options))

  if (!name) {
    if (options.type !== 'nop') {
      throw new Error('storage have to be `nop` with a un-named storage')
    }
    name = 'nop'
  }

  if (!options.type || !(options.type in BACKEND_FACTORY_DICT)) {
    throw new Error('backend unknown: ' + options.type)
  }

  const Backend = await BACKEND_FACTORY_DICT[options.type]()
  const backend = new Backend(name, options)
  return backend
}

export { getStorage }
