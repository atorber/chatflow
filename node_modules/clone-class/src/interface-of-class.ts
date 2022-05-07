import type { Constructor } from './constructor.js'

const interfaceOfClass = <C extends Constructor> (Klass: C) => {
  /**
   * Get properties of a class
   * @see https://stackoverflow.com/a/40637896/1123955
   */
  /**
   * Huan(202110): we decide not to check the instance properties
   *  because the instance properties are not always the same as the class properties
   */
  // const instance = new Klass()
  // const instanceProperties = Object.getOwnPropertyNames(instance)

  const propertySet: Set<string> = new Set()

  let currentPrototype: undefined | {} = Klass.prototype

  while (currentPrototype && currentPrototype !== Object.prototype) {
    Object
      .getOwnPropertyNames(currentPrototype)
      .filter(property => property !== 'constructor') // ignore `constructor`
      .filter(property => !property.startsWith('_'))  // ignore property names starting with `_`
      .forEach(prop => propertySet.add(prop))
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }

  // console.info('propertySet:', propertySet)

  if (propertySet.size === 0) {
    throw new Error(`${Klass.name} has no prototype properties`)
  }

  return <I extends {}> () =>
    (target: any): target is I => {

      if (target instanceof Object) {
        return [...propertySet]
          .every(prop => prop in target)
      }
      return false

    }
}

export { interfaceOfClass }
