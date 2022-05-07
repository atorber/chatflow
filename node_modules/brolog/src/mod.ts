import {
  VERSION,
}               from './config.js'
import {
  Brolog,
  log,
}               from './brolog.js'
import type {
  Loggable,   // @deprecated: use Logger instead. will be removed after Dec 31, 2022
  Logger,
}               from './logger.js'
import {
  getLoggable,  // @deprecated: use getLogger instead. will be removed after Dec 31, 2022
  getLogger,
}               from './logger.js'

export type {
  Loggable, // @deprecated: use Logger instead. will be removed after Dec 31, 2022
  Logger,
}
export {
  VERSION,
  Brolog,
  getLoggable,  // @deprecated: use getLogger instead. will be removed after Dec 31, 2022
  getLogger,
  log,
}
