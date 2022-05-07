/* eslint-disable sort-keys */
import {
  command,
  option,
  optional,
  positional,
  string,
}                 from 'cmd-ts'
import { File }   from 'cmd-ts/dist/cjs/batteries/fs.js'

import { sourceHandler } from './source-handler.js'

async function handler (args: any) {
  const result = await sourceHandler(args)
  console.log(result)
}

const source = command({
  name: 'source',
  description: 'Dump sidecar agent source',
  args: {
    file: positional({
      type        : File,
      displayName : 'classFile',
      description : 'The file contains the sidecar class',
    }),
    name: option({
      description: 'The name of class that decorated by @Sidecar',
      long: 'name',
      short: 'n',
      type: optional(string),
    }),
  },
  handler,
})

export { source }
