/**
 * @since 2.0.0
 */
import { Applicative2 } from './Applicative'
import { Apply2 } from './Apply'
import { Category2 } from './Category'
import { Chain2 } from './Chain'
import { Choice2 } from './Choice'
import { Functor2 } from './Functor'
import { Monad2 } from './Monad'
import { Monoid } from './Monoid'
import { Pointed2 } from './Pointed'
import { Profunctor2 } from './Profunctor'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Semigroup } from './Semigroup'
import { Strong2 } from './Strong'
/**
 * @category model
 * @since 2.0.0
 */
export interface Reader<R, A> {
  (r: R): A
}
/**
 * Reads the current context
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const ask: <R>() => Reader<R, R>
/**
 * Projects a value from the global context in a Reader
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => Reader<R, A>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const local: <R2, R1>(f: (r2: R2) => R1) => <A>(ma: Reader<R1, A>) => Reader<R2, A>
/**
 * Less strict version of [`asksReader`](#asksreader).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderW: <R1, R2, A>(f: (r1: R1) => Reader<R2, A>) => Reader<R1 & R2, A>
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReader: <R, A>(f: (r: R) => Reader<R, A>) => Reader<R, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, A>) => Reader<R, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export declare const apW: <R2, A>(fa: Reader<R2, A>) => <R1, B>(fab: Reader<R1, (a: A) => B>) => Reader<R1 & R2, B>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <R, A>(fa: Reader<R, A>) => <B>(fab: Reader<R, (a: A) => B>) => Reader<R, B>
/**
 * @category Pointed
 * @since 2.0.0
 */
export declare const of: Pointed2<URI>['of']
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export declare const chainW: <R2, A, B>(f: (a: A) => Reader<R2, B>) => <R1>(ma: Reader<R1, A>) => Reader<R1 & R2, B>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export declare const chain: <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: Reader<R, A>) => Reader<R, B>
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const flattenW: <R1, R2, A>(mma: Reader<R1, Reader<R2, A>>) => Reader<R1 & R2, A>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <R, A>(mma: Reader<R, Reader<R, A>>) => Reader<R, A>
/**
 * @category Semigroupoid
 * @since 2.0.0
 */
export declare const compose: <A, B>(ab: Reader<A, B>) => <C>(bc: Reader<B, C>) => Reader<A, C>
/**
 * @category Profunctor
 * @since 2.0.0
 */
export declare const promap: <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fea: Reader<E, A>) => Reader<D, B>
/**
 * @category Category
 * @since 2.0.0
 */
export declare const id: Category2<URI>['id']
/**
 * @category Strong
 * @since 2.10.0
 */
export declare const first: Strong2<URI>['first']
/**
 * @category Strong
 * @since 2.10.0
 */
export declare const second: Strong2<URI>['second']
/**
 * @category Choice
 * @since 2.10.0
 */
export declare const left: Choice2<URI>['left']
/**
 * @category Choice
 * @since 2.10.0
 */
export declare const right: Choice2<URI>['right']
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'Reader'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Reader<E, A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor2<URI>
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const flap: <A>(a: A) => <E, B>(fab: Reader<E, (a: A) => B>) => Reader<E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply2<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apFirst: <E, B>(second: Reader<E, B>) => <A>(first: Reader<E, A>) => Reader<E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apFirstW: <R2, A, B>(second: Reader<R2, B>) => <R1>(first: Reader<R1, A>) => Reader<R1 & R2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <E, B>(second: Reader<E, B>) => <A>(first: Reader<E, A>) => Reader<E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apSecondW: <R2, A, B>(second: Reader<R2, B>) => <R1>(first: Reader<R1, A>) => Reader<R1 & R2, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Monad: Monad2<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const chainFirst: <A, E, B>(f: (a: A) => Reader<E, B>) => (first: Reader<E, A>) => Reader<E, A>
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstW: <R2, A, B>(
  f: (a: A) => Reader<R2, B>
) => <R1>(ma: Reader<R1, A>) => Reader<R1 & R2, A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Profunctor: Profunctor2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Category: Category2<URI>
/**
 * @category instances
 * @since 2.8.3
 */
export declare const Strong: Strong2<URI>
/**
 * @category instances
 * @since 2.8.3
 */
export declare const Choice: Choice2<URI>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(fa: Reader<E, A>) => Reader<E, { readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Reader<E, B>
) => (ma: Reader<E, A>) => Reader<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Reader<R2, B>
) => <R1>(
  fa: Reader<R1, A>
) => Reader<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.9.0
 */
export declare const Do: Reader<unknown, {}>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Reader<E, B>
) => (fa: Reader<E, A>) => Reader<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, R2, B>(
  name: Exclude<N, keyof A>,
  fb: Reader<R2, B>
) => <R1>(
  fa: Reader<R1, A>
) => Reader<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: Reader<unknown, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => Reader<R, B>
) => (as: ReadonlyNonEmptyArray<A>) => Reader<R, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => Reader<R, B>
) => (as: readonly A[]) => Reader<R, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, A, B>(
  f: (index: number, a: A) => Reader<R, B>
) => (as: ReadonlyArray<A>) => Reader<R, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <R, A, B>(
  f: (a: A) => Reader<R, B>
) => (as: readonly A[]) => Reader<R, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <R, A>(arr: ReadonlyArray<Reader<R, A>>) => Reader<R, ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const reader: Monad2<URI> & Profunctor2<URI> & Category2<URI> & Strong2<URI> & Choice2<URI>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <R, A>(S: Semigroup<A>) => Semigroup<Reader<R, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getMonoid: <R, A>(M: Monoid<A>) => Monoid<Reader<R, A>>
