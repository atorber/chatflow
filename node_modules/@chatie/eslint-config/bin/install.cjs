#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const pkgUp = require('pkg-up')

const ESLINTRC_CJS_CONTENT = `
const rules = {
}

module.exports = {
  extends: '@chatie',
  rules,
}
`

const RC_EXT_LIST = [
  'cjs',
  'js',
  'yaml',
]

async function main () {
  const cwd = path.join(__dirname, '..', '..')
  const pkgFile = await pkgUp({ cwd })
  if (!pkgFile) {
    return 0
  }
  const pkgDir = path.dirname(pkgFile)

  const existRc = RC_EXT_LIST.some(ext => fs.existsSync(
    path.join(pkgDir, `.eslintrc.${ext}`)
  ))

  if (!existRc) {
    const eslintRcJsFile = path.join(pkgDir, '.eslintrc.cjs')
    console.info(`@chatie/eslint-config: auto generated ${eslintRcJsFile}`)
    fs.writeFileSync(eslintRcJsFile, ESLINTRC_CJS_CONTENT)
  }
  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.info(e)
    process.exit(1)
  })
