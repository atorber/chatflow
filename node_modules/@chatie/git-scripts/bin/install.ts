#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import util from 'util'

import pkgUp from 'pkg-up'

interface PackageGitScripts {
  git?: {
    scripts?: {
      'pre-push'?: string
    }
  }
}

const PRE_PUSH_CMD = 'npx git-scripts-pre-push'

async function main (): Promise<number> {
  const cwd = path.join(
    __dirname,  // bin
    '..',       // dist
    '..',       // root
    '..',       // @chatie
  )

  const pkgFile = await pkgUp({ cwd })

  if (!pkgFile) {
    return 0
  }

  const pkg = require(pkgFile) as PackageGitScripts

  if (pkg && pkg.git && pkg.git.scripts && pkg.git.scripts['pre-push']) {
    // there's a existing pre-push value
    return 0
  }

  pkg.git = pkg.git || {}

  pkg.git.scripts = {
    ...pkg.git.scripts,
    'pre-push': PRE_PUSH_CMD,
  }

  const jsonText = JSON.stringify(pkg, null, 2)
  const promiseWriteFile = util.promisify(fs.writeFile)

  await promiseWriteFile(pkgFile, jsonText)

  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
