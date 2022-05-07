/**
 * The `Eq` type class represents types which support decidable equality.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Reflexivity: `E.equals(a, a) === true`
 * 2. Symmetry: `E.equals(a, b) === E.equals(b, a)`
 * 3. Transitivity: if `E.equals(a, b) === true` and `E.equals(b, c) === true`, then `E.equals(a, c) === true`
 *
 * @since 2.0.0
 */
import { Contravariant1 } from './Contravariant'
import { Monoid } from './Monoid'
import { ReadonlyRecord } from './ReadonlyRecord'
import { Semigroup } from './Semigroup'
/**
 * @category type classes
 * @since 2.0.0
 */
export interface Eq<A> {
  readonly equals: (x: A, y: A) => boolean
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromEquals: <A>(equals: (x: A, y: A) => boolean) => Eq<A>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const struct: <A>(eqs: { [K in keyof A]: Eq<A[K]> }) => Eq<{ readonly [K_1 in keyof A]: A[K_1] }>
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Eq'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import * as B from 'fp-ts/boolean'
 *
 * const E = tuple(S.Eq, N.Eq, B.Eq)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const tuple: <A extends readonly unknown[]>(...eqs: { [K in keyof A]: Eq<A[K]> }) => Eq<Readonly<A>>
/**
 * @category Contravariant
 * @since 2.0.0
 */
export declare const contramap: <A, B>(f: (b: B) => A) => (fa: Eq<A>) => Eq<B>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'Eq'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Eq<A>
  }
}
/**
 * @category instances
 * @since 2.5.0
 */
export declare const eqStrict: Eq<unknown>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getSemigroup: <A>() => Semigroup<Eq<A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getMonoid: <A>() => Monoid<Eq<A>>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Contravariant: Contravariant1<URI>
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
export declare const getTupleEq: <T extends ReadonlyArray<Eq<any>>>(
  ...eqs: T
) => Eq<
  {
    [K in keyof T]: T[K] extends Eq<infer A> ? A : never
  }
>
/**
 * Use [`struct`](#struct) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
export declare const getStructEq: <O extends ReadonlyRecord<string, any>>(
  eqs: {
    [K in keyof O]: Eq<O[K]>
  }
) => Eq<O>
/**
 * Use [`eqStrict`](#eqstrict) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export declare const strictEqual: <A>(a: A, b: A) => boolean
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const eq: Contravariant1<URI>
/**
 * Use [`Eq`](./boolean.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const eqBoolean: Eq<boolean>
/**
 * Use [`Eq`](./string.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const eqString: Eq<string>
/**
 * Use [`Eq`](./number.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const eqNumber: Eq<number>
/**
 * Use [`Eq`](./Date.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const eqDate: Eq<Date>
