/**
 * @since 2.0.0
 */
import { Alt3, Alt3C } from './Alt'
import { Applicative3, Applicative3C } from './Applicative'
import { Apply1, Apply3 } from './Apply'
import { Bifunctor3 } from './Bifunctor'
import { Chain3 } from './Chain'
import { Compactable3C } from './Compactable'
import * as E from './Either'
import { Filterable3C } from './Filterable'
import { FromEither3 } from './FromEither'
import { FromIO3 } from './FromIO'
import { FromReader3 } from './FromReader'
import { FromTask3 } from './FromTask'
import { Lazy } from './function'
import { Functor3 } from './Functor'
import { IO } from './IO'
import { IOEither, URI as IEURI } from './IOEither'
import { Monad3, Monad3C } from './Monad'
import { MonadIO3 } from './MonadIO'
import { MonadTask3, MonadTask3C } from './MonadTask'
import { MonadThrow3, MonadThrow3C } from './MonadThrow'
import { Monoid } from './Monoid'
import { NaturalTransformation13C, NaturalTransformation23, NaturalTransformation33 } from './NaturalTransformation'
import { URI as OURI } from './Option'
import { Pointed3 } from './Pointed'
import { Predicate } from './Predicate'
import * as R from './Reader'
import { ReaderEither, URI as REURI } from './ReaderEither'
import * as RT from './ReaderTask'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import * as T from './Task'
import * as TE from './TaskEither'
import Either = E.Either
import Task = T.Task
import TaskEither = TE.TaskEither
import Reader = R.Reader
import ReaderTask = RT.ReaderTask
/**
 * @category model
 * @since 2.0.0
 */
export interface ReaderTaskEither<R, E, A> {
  (r: R): TaskEither<E, A>
}
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromTaskEither: NaturalTransformation23<TE.URI, URI>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const left: <R, E = never, A = never>(e: E) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const right: <R, E = never, A = never>(a: A) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightTask: <R, E = never, A = never>(ma: Task<A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftTask: <R, E = never, A = never>(me: Task<E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightReader: <R, E = never, A = never>(ma: Reader<R, A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftReader: <R, E = never, A = never>(me: Reader<R, E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.5.0
 */
export declare const rightReaderTask: <R, E = never, A = never>(ma: ReaderTask<R, A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.5.0
 */
export declare const leftReaderTask: <R, E = never, A = never>(me: ReaderTask<R, E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightIO: <R, E = never, A = never>(ma: IO<A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftIO: <R, E = never, A = never>(me: IO<E>) => ReaderTaskEither<R, E, A>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromEither: FromEither3<URI>['fromEither']
/**
 * @category natural transformations
 * @since 2.11.0
 */
export declare const fromReader: FromReader3<URI>['fromReader']
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromIO: FromIO3<URI>['fromIO']
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromTask: FromTask3<URI>['fromTask']
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromIOEither: NaturalTransformation23<IEURI, URI>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromReaderEither: NaturalTransformation33<REURI, URI>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B>
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B | C>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const matchE: <R, E, A, B>(
  onLeft: (e: E) => ReaderTask<R, B>,
  onRight: (a: A) => ReaderTask<R, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
export declare const fold: <R, E, A, B>(
  onLeft: (e: E) => RT.ReaderTask<R, B>,
  onRight: (a: A) => RT.ReaderTask<R, B>
) => (ma: ReaderTaskEither<R, E, A>) => RT.ReaderTask<R, B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchEW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => ReaderTask<R2, B>,
  onRight: (a: A) => ReaderTask<R3, C>
) => <R1>(ma: ReaderTaskEither<R1, E, A>) => ReaderTask<R1 & R2 & R3, B | C>
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const foldW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => RT.ReaderTask<R2, B>,
  onRight: (a: A) => RT.ReaderTask<R3, C>
) => <R1>(ma: ReaderTaskEither<R1, E, A>) => RT.ReaderTask<R1 & R2 & R3, B | C>
/**
 * @category destructors
 * @since 2.0.0
 */
export declare const getOrElse: <R, E, A>(
  onLeft: (e: E) => ReaderTask<R, A>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
export declare const getOrElseW: <R2, E, B>(
  onLeft: (e: E) => ReaderTask<R2, B>
) => <R1, A>(ma: ReaderTaskEither<R1, E, A>) => ReaderTask<R1 & R2, A | B>
/**
 * @category interop
 * @since 2.10.0
 */
export declare const toUnion: <R, E, A>(fa: ReaderTaskEither<R, E, A>) => ReaderTask<R, E | A>
/**
 * @category interop
 * @since 2.12.0
 */
export declare const fromNullable: <E>(e: E) => <R, A>(a: A) => ReaderTaskEither<R, E, NonNullable<A>>
/**
 * @category interop
 * @since 2.12.0
 */
export declare const fromNullableK: <E>(
  e: E
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => <R>(...a: A) => ReaderTaskEither<R, E, NonNullable<B>>
/**
 * @category interop
 * @since 2.12.0
 */
export declare const chainNullableK: <E>(
  e: E
) => <A, B>(
  f: (a: A) => B | null | undefined
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, NonNullable<B>>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const local: <R2, R1>(
  f: (r2: R2) => R1
) => <E, A>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R2, E, A>
/**
 * Less strict version of [`asksReaderTaskEither`](#asksreadertaskeither).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderTaskEitherW: <R1, R2, E, A>(
  f: (r1: R1) => ReaderTaskEither<R2, E, A>
) => ReaderTaskEither<R1 & R2, E, A>
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderTaskEither: <R, E, A>(
  f: (r: R) => ReaderTaskEither<R, E, A>
) => ReaderTaskEither<R, E, A>
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const orElse: <R, E1, A, E2>(
  onLeft: (e: E1) => ReaderTaskEither<R, E2, A>
) => (ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E2, A>
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const orElseW: <E1, R1, E2, B>(
  onLeft: (e: E1) => ReaderTaskEither<R1, E2, B>
) => <R2, A>(ma: ReaderTaskEither<R2, E1, A>) => ReaderTaskEither<R1 & R2, E2, A | B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orElseFirst: <E, R, B>(
  onLeft: (e: E) => ReaderTaskEither<R, E, B>
) => <A>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orElseFirstW: <E1, R2, E2, B>(
  onLeft: (e: E1) => ReaderTaskEither<R2, E2, B>
) => <R1, A>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orLeft: <E1, R, E2>(
  onLeft: (e: E1) => ReaderTask<R, E2>
) => <A>(fa: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E2, A>
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const swap: <R, E, A>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, A, E>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromIOEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => IOEither<E, B>
) => <R>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromTaskEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => TE.TaskEither<E, B>
) => <R>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainFirstTaskEitherK`](#chainfirsttaskeitherk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromReaderEitherK: <R, E, A extends readonly unknown[], B>(
  f: (...a: A) => ReaderEither<R, E, B>
) => (...a: A) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainReaderEitherK`](#chainreadereitherk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderEitherKW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderEitherK: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainFirstReaderEitherK`](#chainfirstreadereitherk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderEitherKW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderEitherK: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R, E>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, B>
/**
 * Map a function over the second type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
export declare const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, A>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <R, E, A>(
  fa: ReaderTaskEither<R, E, A>
) => <B>(fab: ReaderTaskEither<R, E, (a: A) => B>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export declare const apW: <R2, E2, A>(
  fa: ReaderTaskEither<R2, E2, A>
) => <R1, E1, B>(fab: ReaderTaskEither<R1, E1, (a: A) => B>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * @category Pointed
 * @since 2.7.0
 */
export declare const of: <R, E = never, A = never>(a: A) => ReaderTaskEither<R, E, A>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export declare const chain: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export declare const chainW: <R2, E2, A, B>(
  f: (a: A) => ReaderTaskEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const flattenW: <R1, E1, R2, E2, A>(
  mma: ReaderTaskEither<R1, E1, ReaderTaskEither<R2, E2, A>>
) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <R, E, A>(
  mma: ReaderTaskEither<R, E, ReaderTaskEither<R, E, A>>
) => ReaderTaskEither<R, E, A>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
export declare const alt: <R, E, A>(
  that: () => ReaderTaskEither<R, E, A>
) => (fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export declare const altW: <R2, E2, B>(
  that: () => ReaderTaskEither<R2, E2, B>
) => <R1, E1, A>(fa: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E2, A | B>
/**
 * @category MonadThrow
 * @since 2.0.0
 */
export declare const throwError: MonadThrow3<URI>['throwError']
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'ReaderTaskEither'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderTaskEither<R, E, A>
  }
}
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getCompactable: <E>(M: Monoid<E>) => Compactable3C<'ReaderTaskEither', E>
/**
 * @category instances
 * @since 2.10.0
 */
export declare function getFilterable<E>(M: Monoid<E>): Filterable3C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getApplicativeReaderTaskValidation<E>(A: Apply1<T.URI>, S: Semigroup<E>): Applicative3C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getAltReaderTaskValidation<E>(S: Semigroup<E>): Alt3C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor3<URI>
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const flap: <A>(a: A) => <R, E, B>(fab: ReaderTaskEither<R, E, (a: A) => B>) => ReaderTaskEither<R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplyPar: Apply3<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apFirst: <R, E, B>(
  second: ReaderTaskEither<R, E, B>
) => <A>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apFirstW: <R2, E2, A, B>(
  second: ReaderTaskEither<R2, E2, B>
) => <R1, E1>(first: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <R, E, B>(
  second: ReaderTaskEither<R, E, B>
) => <A>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apSecondW: <R2, E2, A, B>(
  second: ReaderTaskEither<R2, E2, B>
) => <R1, E1>(first: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativePar: Applicative3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplySeq: Apply3<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativeSeq: Applicative3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadThrow: MonadThrow3<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const chainFirst: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
export declare const chainFirstW: <R2, E2, A, B>(
  f: (a: A) => ReaderTaskEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor3<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt3<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromReader: FromReader3<URI>
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const ask: <R, E = never>() => ReaderTaskEither<R, E, R>
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const asks: <R, A, E = never>(f: (r: R) => A) => ReaderTaskEither<R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <E = never>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2, E = never>(ma: ReaderTaskEither<R2, E, A>) => ReaderTaskEither<R1 & R2, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => R.Reader<R, B>
) => <E = never>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2, E = never>(ma: ReaderTaskEither<R2, E, A>) => ReaderTaskEither<R1 & R2, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromReaderTaskK: <A extends readonly unknown[], R, B>(
  f: (...a: A) => RT.ReaderTask<R, B>
) => <E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainReaderTaskK`](#chainreadertaskk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderTaskKW: <A, R2, B>(
  f: (a: A) => RT.ReaderTask<R2, B>
) => <R1, E = never>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderTaskK: <A, R, B>(
  f: (a: A) => RT.ReaderTask<R, B>
) => <E = never>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainFirstReaderTaskK`](#chainfirstreadertaskk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderTaskKW: <A, R2, B>(
  f: (a: A) => RT.ReaderTask<R2, B>
) => <R1, E = never>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderTaskK: <A, R, B>(
  f: (a: A) => RT.ReaderTask<R, B>
) => <E = never>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither3<URI>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromOption: <E>(onNone: Lazy<E>) => NaturalTransformation13C<OURI, URI, E>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: Lazy<E>
) => <A extends readonly unknown[], B>(
  f: (...a: A) => import('./Option').Option<B>
) => <R>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainOptionK: <E>(
  onNone: Lazy<E>
) => <A, B>(
  f: (a: A) => import('./Option').Option<B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R, B extends A>(b: B) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderTaskEither<R, E, A>
}
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderTaskEither<R, E, A>
  ) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R, B extends A>(
    mb: ReaderTaskEither<R, E, B>
  ) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
}
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
export declare const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1, B extends A>(
    mb: ReaderTaskEither<R, E1, B>
  ) => ReaderTaskEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E1 | E2, A>
}
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <R>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO3<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => IO<B>
) => <R, E>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainIOK: <A, B>(
  f: (a: A) => IO<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(
  f: (a: A) => IO<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask3<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromTaskK: <A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => <R, E>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainTaskK: <A, B>(
  f: (a: A) => T.Task<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(
  f: (a: A) => T.Task<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.4
 */
export declare function bracket<R, E, A, B>(
  acquire: ReaderTaskEither<R, E, A>,
  use: (a: A) => ReaderTaskEither<R, E, B>,
  release: (a: A, e: Either<E, B>) => ReaderTaskEither<R, E, void>
): ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
export declare function bracketW<R1, E1, A, R2, E2, B, R3, E3>(
  acquire: ReaderTaskEither<R1, E1, A>,
  use: (a: A) => ReaderTaskEither<R2, E2, B>,
  release: (a: A, e: Either<E2, B>) => ReaderTaskEither<R3, E3, void>
): ReaderTaskEither<R1 & R2 & R3, E1 | E2 | E3, B>
/**
 * @since 2.9.0
 */
export declare const Do: ReaderTaskEither<unknown, never, {}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <R, E, A>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, { readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (
  ma: ReaderTaskEither<R, E, A>
) => ReaderTaskEither<R, E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderTaskEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderTaskEither<R1, E1, A>
) => ReaderTaskEither<
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTaskEither<R, E, B>
) => (
  fa: ReaderTaskEither<R, E, A>
) => ReaderTaskEither<R, E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTaskEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderTaskEither<R1, E1, A>
) => ReaderTaskEither<
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: ReaderTaskEither<unknown, never, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTaskEither<R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: readonly A[]) => ReaderTaskEither<R, E, readonly B[]>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTaskEither<R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: readonly A[]) => ReaderTaskEither<R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, E, A, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (as: readonly A[]) => ReaderTaskEither<R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <R, E, A>(
  arr: ReadonlyArray<ReaderTaskEither<R, E, A>>
) => ReaderTaskEither<R, E, ReadonlyArray<A>>
/**
 * @since 2.9.0
 */
export declare const traverseSeqArrayWithIndex: <R, E, A, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseSeqArray: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (as: readonly A[]) => ReaderTaskEither<R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceSeqArray: <R, E, A>(
  arr: ReadonlyArray<ReaderTaskEither<R, E, A>>
) => ReaderTaskEither<R, E, ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const readerTaskEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI> & MonadTask3<URI> & MonadThrow3<URI>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const readerTaskEitherSeq: typeof readerTaskEither
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplySemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderTaskEither<R, E, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplyMonoid: <R, E, A>(M: Monoid<A>) => Monoid<ReaderTaskEither<R, E, A>>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderTaskEither<R, E, A>>
/**
 * Use [`getApplicativeReaderTaskValidation`](#getapplicativereadertaskvalidation) and [`getAltReaderTaskValidation`](#getaltreadertaskvalidation) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare function getReaderTaskValidation<E>(
  SE: Semigroup<E>
): Monad3C<URI, E> & Bifunctor3<URI> & Alt3C<URI, E> & MonadTask3C<URI, E> & MonadThrow3C<URI, E>
/**
 * @since 2.0.0
 * @deprecated
 */
export declare function run<R, E, A>(ma: ReaderTaskEither<R, E, A>, r: R): Promise<Either<E, A>>
