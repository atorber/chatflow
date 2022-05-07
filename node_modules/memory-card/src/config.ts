import { VERSION } from './version.js'

// https://github.com/Microsoft/TypeScript/issues/14151#issuecomment-280812617
// Huan(202111): we are require Node.js v16 now, so this should be able to be removed safely.
// if (!Symbol.asyncIterator) {
//   (Symbol as any).asyncIterator = Symbol.for('Symbol.asyncIterator')
// }

export {
  log,
}           from 'brolog'

export {
  VERSION,
}
