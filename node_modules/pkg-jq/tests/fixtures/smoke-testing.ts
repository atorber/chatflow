#!/usr/bin/env ts-node

// tslint:disable:arrow-parens
// tslint:disable:max-line-length
// tslint:disable:member-ordering
// tslint:disable:no-shadowed-variable
// tslint:disable:unified-signatures
// tslint:disable:no-console

import {
  VERSION,
}                 from 'pkg-jq'

async function main () {
  if (VERSION === '0.0.0') {
    throw new Error('version not set right before publish!')
  }
  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.info(e)
    process.exit(1)
  })
