import type { Constructor } from './constructor.js'

/**
 * Huan(202011)
 *  Create a `looseInstanceOfClass` to check `FileBox` and `Puppet` instances #2090
 *    https://github.com/wechaty/wechaty/issues/2090
 *
 * `instanceof`: checking by constructor name.
 */
const looseInstanceOfClass = <C extends Constructor> (Klass: C) => (target: any): target is InstanceType<C> => {
  /**
   * Easy way
   */
  if (target instanceof Klass) {
    /**
     * Singleton Module
     */
    return true
  }

  /**
   *
   * Hard (loose) way
   *
   */

  if (!target || typeof target !== 'object') {
    return false
  }

  if (typeof target.constructor !== 'function') {
    /**
     * Not a class?
     */
    return false
  }

  if (target.constructor.name === Klass.name) {
    /**
     * Different Module Class with the same name
     *  with a direct instance class
     */
    return true
  }

  const parent = Reflect.getPrototypeOf(target.constructor.prototype)
  if (!parent) {
    /**
     * No parent class
     */
    return false
  }

  if (parent.constructor.name === Klass.name) {
    /**
     * Different Module class with the same name
     *  but the instance is a child class
     */
    return true
  }

  /**
   * Not match any of the above
   */
  return false
}

export { looseInstanceOfClass }
