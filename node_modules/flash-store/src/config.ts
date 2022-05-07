import { log } from 'brolog'

import { packageJson } from './package-json.js'

const VERSION = packageJson.version || '0.0.0'

/// <reference path="./typings.d.ts" />

export {
  log,
  VERSION,
}
