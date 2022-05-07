
/**
 * Clone Class for easy savig Information into Static Properties
 * https://github.com/Chatie/wechaty/issues/518
 */
import type { Constructor } from './constructor.js'

// tslint:disable-next-line:variable-name
function cloneClass<T extends Constructor<{}>> (OriginalClass: T): T {

  for (const staticProperty in OriginalClass) {
    /**
     * 1. Skip the name with a captial letter,
     * like: Type
     */
    if (/^[A-Z]/.test(staticProperty)) {
      continue
    }

    /**
     * 2. Check wether the property is initialized
     */
    if (typeof OriginalClass[staticProperty] === 'object') {
      throw new Error('static property initialized to an object with defination is not supported with cloneClass.')
    }
  }

  class AnotherOriginalClass extends OriginalClass {

    constructor (...args: any[]) {
      super(...args)
    }

  }

  Reflect.defineProperty(AnotherOriginalClass, 'name', {
    value: OriginalClass.name,
  })

  return AnotherOriginalClass
}

export {
  cloneClass,
}
