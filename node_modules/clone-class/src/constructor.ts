/**
 * Huan LI <zixia@zixia.net>
 */

/**
 * Constructor<T>
 *  https://stackoverflow.com/a/50116912/1123955
 *
 * See also:
 *  - https://github.com/Microsoft/TypeScript/issues/10262
 *  - https://github.com/Microsoft/TypeScript/issues/5843#issuecomment-290972055
 *  - https://github.com/Microsoft/TypeScript/pull/13743
 *
 *  - Types for classes as values in TypeScript
 *      https://2ality.com/2020/04/classes-as-values-typescript.html
 */

export type ClassInterface<C> = {
  [key in keyof C]: C[key];
}

type InstanceInterface <I> = {
  new (...args: any[]): I
  prototype: I
}

/**
 * Huan(202108) version:
 *
 * T: the `Class`
 * P: `typeof Class`
 */
 type Constructor<
  I extends {} = {},
  C = {}
> = ClassInterface<C> & InstanceInterface<I>

/**
 * https://github.com/wechaty/wechaty/issues/2090
 *
 * Warning: the InstantiatableClass returned by `constructor()` is not really instanciatable:
 *  it's just for typing compatible for some special conditions
 */

export type {
  Constructor,
}
