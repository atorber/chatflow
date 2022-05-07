/**
 * ```ts
 * interface IO<A> {
 *   (): A
 * }
 * ```
 *
 * `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**. If you want to represent a synchronous computation that may fail, please see
 * `IOEither`.
 *
 * @since 2.0.0
 */
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import { Chain1 } from './Chain'
import { ChainRec1 } from './ChainRec'
import { FromIO1 } from './FromIO'
import { Functor1 } from './Functor'
import { Monad1 } from './Monad'
import { MonadIO1 } from './MonadIO'
import { Monoid } from './Monoid'
import { Pointed1 } from './Pointed'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Semigroup } from './Semigroup'
/**
 * @category model
 * @since 2.0.0
 */
export interface IO<A> {
  (): A
}
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: IO<A>) => IO<B>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <A>(fa: IO<A>) => <B>(fab: IO<(a: A) => B>) => IO<B>
/**
 * @category Pointed
 * @since 2.0.0
 */
export declare const of: Pointed1<URI>['of']
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export declare const chain: <A, B>(f: (a: A) => IO<B>) => (ma: IO<A>) => IO<B>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <A>(mma: IO<IO<A>>) => IO<A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'IO'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: IO<A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor1<URI>
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const flap: <A>(a: A) => <B>(fab: IO<(a: A) => B>) => IO<B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply1<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apFirst: <B>(second: IO<B>) => <A>(first: IO<A>) => IO<A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <B>(second: IO<B>) => <A>(first: IO<A>) => IO<B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Monad: Monad1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => IO<B>) => (first: IO<A>) => IO<A>
/**
 * @category constructors
 * @since 2.7.0
 * @deprecated
 */
export declare const fromIO: FromIO1<URI>['fromIO']
/**
 * @category instances
 * @since 2.7.0
 */
export declare const MonadIO: MonadIO1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ChainRec: ChainRec1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO1<URI>
/**
 * @since 2.9.0
 */
export declare const Do: IO<{}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(name: N) => <A>(fa: IO<A>) => IO<{ readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => IO<B>
) => (ma: IO<A>) => IO<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: IO<B>
) => (fa: IO<A>) => IO<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.11.0
 */
export declare const ApT: IO<readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IO<B>
) => (as: ReadonlyNonEmptyArray<A>) => IO<ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IO<B>
) => (as: readonly A[]) => IO<readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IO<B>
) => (as: ReadonlyArray<A>) => IO<ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <A, B>(f: (a: A) => IO<B>) => (as: readonly A[]) => IO<readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <A>(arr: ReadonlyArray<IO<A>>) => IO<ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const io: Monad1<URI> & MonadIO1<URI> & ChainRec1<URI>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <A>(S: Semigroup<A>) => Semigroup<IO<A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getMonoid: <A>(M: Monoid<A>) => Monoid<IO<A>>
