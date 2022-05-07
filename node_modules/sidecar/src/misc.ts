// import ref from 'ref'

/**
 * Huan(202106):
    > class Test {}
    undefined
    > typeof Test
    'function'
    > const t = new Test()
    undefined
    > typeof t
    'object'
 */
function isInstance (target: any): boolean {
  switch (typeof target) {
    case 'function':  // Class
      if (target.name) {
        return false
      }
      break
    case 'object':  // instance
      if (!target.name) {
        return true
      }
      break
  }
  throw new Error('FIXME: Unknown state for target.')
}

export {
  isInstance,
}
