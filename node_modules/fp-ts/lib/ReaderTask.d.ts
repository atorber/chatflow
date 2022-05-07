/**
 * @since 2.3.0
 */
import { Applicative2 } from './Applicative'
import { Apply2 } from './Apply'
import { Chain2 } from './Chain'
import { FromIO2 } from './FromIO'
import { FromReader2 } from './FromReader'
import { FromTask2 } from './FromTask'
import { Functor2 } from './Functor'
import { Monad2 } from './Monad'
import { MonadIO2 } from './MonadIO'
import { MonadTask2 } from './MonadTask'
import { Monoid } from './Monoid'
import { Pointed2 } from './Pointed'
import * as R from './Reader'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Semigroup } from './Semigroup'
import * as T from './Task'
import Task = T.Task
/**
 * @category model
 * @since 2.3.0
 */
export interface ReaderTask<R, A> {
  (r: R): Task<A>
}
/**
 * @category natural transformations
 * @since 2.3.0
 */
export declare const fromReader: FromReader2<URI>['fromReader']
/**
 * @category natural transformations
 * @since 2.3.0
 */
export declare const fromTask: FromTask2<URI>['fromTask']
/**
 * @category natural transformations
 * @since 2.3.0
 */
export declare const fromIO: FromIO2<URI>['fromIO']
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.3.0
 */
export declare const local: <R2, R1>(f: (r2: R2) => R1) => <A>(ma: ReaderTask<R1, A>) => ReaderTask<R2, A>
/**
 * Less strict version of [`asksReaderTask`](#asksreadertask).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderTaskW: <R1, R2, A>(f: (r1: R1) => ReaderTask<R2, A>) => ReaderTask<R1 & R2, A>
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderTask: <R, A>(f: (r: R) => ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.3.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R>(fa: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.3.0
 */
export declare const ap: <R, A>(fa: ReaderTask<R, A>) => <B>(fab: ReaderTask<R, (a: A) => B>) => ReaderTask<R, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export declare const apW: <R2, A>(
  fa: ReaderTask<R2, A>
) => <R1, B>(fab: ReaderTask<R1, (a: A) => B>) => ReaderTask<R1 & R2, B>
/**
 * @category Pointed
 * @since 2.3.0
 */
export declare const of: Pointed2<URI>['of']
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.3.0
 */
export declare const chain: <A, R, B>(f: (a: A) => ReaderTask<R, B>) => (ma: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Less strict version of  [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.7
 */
export declare const chainW: <R2, A, B>(
  f: (a: A) => ReaderTask<R2, B>
) => <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const flattenW: <R1, R2, A>(mma: ReaderTask<R1, ReaderTask<R2, A>>) => ReaderTask<R1 & R2, A>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.3.0
 */
export declare const flatten: <R, A>(mma: ReaderTask<R, ReaderTask<R, A>>) => ReaderTask<R, A>
/**
 * @category instances
 * @since 2.3.0
 */
export declare const URI = 'ReaderTask'
/**
 * @category instances
 * @since 2.3.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: ReaderTask<E, A>
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
export declare const flap: <A>(a: A) => <E, B>(fab: ReaderTask<E, (a: A) => B>) => ReaderTask<E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplyPar: Apply2<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.3.0
 */
export declare const apFirst: <E, B>(second: ReaderTask<E, B>) => <A>(first: ReaderTask<E, A>) => ReaderTask<E, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.3.0
 */
export declare const apSecond: <E, B>(second: ReaderTask<E, B>) => <A>(first: ReaderTask<E, A>) => ReaderTask<E, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativePar: Applicative2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplySeq: Apply2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativeSeq: Applicative2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask2<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.3.0
 */
export declare const chainFirst: <A, E, B>(
  f: (a: A) => ReaderTask<E, B>
) => (first: ReaderTask<E, A>) => ReaderTask<E, A>
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstW: <R2, A, B>(
  f: (a: A) => ReaderTask<R2, B>
) => <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO2<URI>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => import('./IO').IO<B>
) => <E>(...a: A) => ReaderTask<E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainIOK: <A, B>(
  f: (a: A) => import('./IO').IO<B>
) => <E>(first: ReaderTask<E, A>) => ReaderTask<E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(
  f: (a: A) => import('./IO').IO<B>
) => <E>(first: ReaderTask<E, A>) => ReaderTask<E, A>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromReader: FromReader2<URI>
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.3.0
 */
export declare const ask: <R>() => ReaderTask<R, R>
/**
 * Projects a value from the global context in a `ReaderTask`.
 *
 * @category constructors
 * @since 2.3.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => ReaderTask<R, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends readonly unknown[], R, B>(
  f: (...a: A) => R.Reader<R, B>
) => (...a: A) => ReaderTask<R, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(f: (a: A) => R.Reader<R, B>) => (ma: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2>(ma: ReaderTask<R2, A>) => ReaderTask<R1 & R2, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => R.Reader<R, B>
) => (ma: ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2>(ma: ReaderTask<R2, A>) => ReaderTask<R1 & R2, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask2<URI>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromTaskK: <A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => <E>(...a: A) => ReaderTask<E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainTaskK: <A, B>(f: (a: A) => T.Task<B>) => <E>(first: ReaderTask<E, A>) => ReaderTask<E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(f: (a: A) => T.Task<B>) => <E>(first: ReaderTask<E, A>) => ReaderTask<E, A>
/**
 * @since 2.9.0
 */
export declare const Do: ReaderTask<unknown, {}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(fa: ReaderTask<E, A>) => ReaderTask<E, { readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderTask<E, B>
) => (ma: ReaderTask<E, A>) => ReaderTask<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderTask<R2, B>
) => <R1>(
  fa: ReaderTask<R1, A>
) => ReaderTask<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTask<E, B>
) => (fa: ReaderTask<E, A>) => ReaderTask<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, R2, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTask<R2, B>
) => <R1>(
  fa: ReaderTask<R1, A>
) => ReaderTask<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: ReaderTask<unknown, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTask<R, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: readonly A[]) => ReaderTask<R, readonly B[]>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTask<R, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: readonly A[]) => ReaderTask<R, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <R, A, B>(
  f: (a: A) => ReaderTask<R, B>
) => (as: readonly A[]) => ReaderTask<R, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <R, A>(arr: ReadonlyArray<ReaderTask<R, A>>) => ReaderTask<R, ReadonlyArray<A>>
/**
 * @since 2.10.0
 */
export declare const traverseSeqArrayWithIndex: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * @since 2.10.0
 */
export declare const traverseSeqArray: <R, A, B>(
  f: (a: A) => ReaderTask<R, B>
) => (as: readonly A[]) => ReaderTask<R, readonly B[]>
/**
 * Use `traverseReadonlyArrayWithIndexSeq` instead.
 *
 * @since 2.10.0
 * @deprecated
 */
export declare const sequenceSeqArray: <R, A>(arr: ReadonlyArray<ReaderTask<R, A>>) => ReaderTask<R, ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare const readerTask: MonadTask2<URI>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare const readerTaskSeq: typeof readerTask
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare const getSemigroup: <R, A>(S: Semigroup<A>) => Semigroup<ReaderTask<R, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare const getMonoid: <R, A>(M: Monoid<A>) => Monoid<ReaderTask<R, A>>
/**
 * @since 2.4.0
 * @deprecated
 */
export declare function run<R, A>(ma: ReaderTask<R, A>, r: R): Promise<A>
