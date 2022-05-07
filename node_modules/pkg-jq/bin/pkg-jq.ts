#!/usr/bin/env node

import { ArgumentParser }   from 'argparse'
import updateNotifier       from 'update-notifier'
import pkgUp                from 'pkg-up'

import {
  jqFile,
  // FIXME: Unused JqOptions ???
  // eslint-disable-next-line
  JqOptions,
}                       from '../src/node-jq'
import { resolveFile }   from '../src/resolve-file'
import { saveFile }      from '../src/save-file'

import {
  VERSION,
}               from '../src/'

async function checkUpdate () {
  const pkgFile   = await pkgUp({ cwd: __dirname })
  if (!pkgFile) {
    throw new Error('package.json not found!')
  }

  const pkg = require(pkgFile)
  const updateCheckInterval = 1000 * 60 * 60 * 24 * 7  // 1 week

  const notifier = updateNotifier({
    pkg,
    updateCheckInterval,
  })

  notifier.notify()
}

async function main (args: Args): Promise<number> {
  checkUpdate().catch(console.info)

  const file   = await resolveFile(args.path)

  const options: JqOptions = {}

  if (args.raw) {
    options.raw = true
  }

  const result = await jqFile(args.filter, file, options)

  if (args.inplace) {
    await saveFile(file, result)
  } else {
    console.info(result)
  }

  return 0
}

interface Args {
  filter  : string
  inplace : boolean
  path    : string
  raw     : boolean
}

function parseArguments (): Args {
  const parser = new ArgumentParser({
    add_help    : true,
    description : 'Node.js Package jq Utility',
    epilog      : 'Exmaple: pkg-jq -i \'.publishConfig.tag="next"\'',
    prog        : 'pkg-jq',
    // version     : VERSION,
  })

  parser.add_argument(
    '-v',
    '--version',
    {
      action: 'version',
      version: VERSION,
    },
  )

  parser.add_argument(
    'filter',
    {
      help: 'jq filter.',
    },
  )

  parser.add_argument(
    'path',
    {
      default : process.cwd(),
      help    : 'npm project subdir, or json file. default: $PWD.',
      nargs   : '?',
    },
  )

  parser.add_argument(
    '-i',
    '--in-place',
    {
      action  : 'store_const',
      const   : true,
      default : false,
      dest    : 'inplace',
      help    : 'edit files in place.',
    },
  )

  parser.add_argument(
    '-r',
    '--raw',
    {
      action  : 'store_const',
      const   : true,
      default : false,
      dest    : 'raw',
      help    : 'output raw strings, not JSON texts.',
    },
  )

  return parser.parse_args()
}

process.on('warning', (warning) => {
  console.info(warning.name)    // Print the warning name
  console.info(warning.message) // Print the warning message
  console.info(warning.stack)   // Print the stack trace
})

main(parseArguments())
  .then(process.exit)
  .catch(e => {
    console.info(e)
    process.exit(1)
  })
