#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const INSTALLJS = path.join(
  __dirname,
  '..',
  'dist',
  'bin',
  'install.js',
)

function main () {
  if (fs.existsSync(INSTALLJS)) {
    require(INSTALLJS)
  } else {
    console.info(`@chatie/git-scripts postinstall ${INSTALLJS} not found`)
  }
}

main()
