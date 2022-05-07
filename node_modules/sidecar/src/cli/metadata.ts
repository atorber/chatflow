/* eslint-disable sort-keys */
import {
  command,
  option,
  optional,
  positional,
  string,
}                 from 'cmd-ts'
import { File }   from 'cmd-ts/dist/cjs/batteries/fs.js'

import { metadataHandler } from './metadata-handler.js'

async function handler (args: any) {
  const result = await metadataHandler(args)
  // print the result
  console.log(result)
}

const metadata = command({
  name: 'metadata',
  description: 'Dump sidecar metadata',
  args: {
    file: positional({
      type        : File,
      displayName : 'classFile',
      description: 'The file contains the sidecar class',
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

export { metadata }
