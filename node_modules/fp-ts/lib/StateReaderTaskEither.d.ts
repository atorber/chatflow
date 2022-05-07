/**
 * @since 2.0.0
 */
import { Alt4 } from './Alt'
import { Applicative4 } from './Applicative'
import { Apply4 } from './Apply'
import { Bifunctor4 } from './Bifunctor'
import { Chain4 } from './Chain'
import * as E from './Either'
import { Endomorphism } from './Endomorphism'
import { FromEither4 } from './FromEither'
import { FromIO4 } from './FromIO'
import { FromReader4 } from './FromReader'
import { FromState4 } from './FromState'
import { FromTask4 } from './FromTask'
import { Lazy } from './function'
import { Functor4 } from './Functor'
import { IO } from './IO'
import { IOEither, URI as IEURI } from './IOEither'
import { Monad4 } from './Monad'
import { MonadIO4 } from './MonadIO'
import { MonadTask4 } from './MonadTask'
import { MonadThrow4 } from './MonadThrow'
import { NaturalTransformation14C, NaturalTransformation24, NaturalTransformation34 } from './NaturalTransformation'
import { URI as OURI } from './Option'
import { Pointed4 } from './Pointed'
import { Predicate } from './Predicate'
import * as R from './Reader'
import { URI as REURI } from './ReaderEither'
import * as RTE from './ReaderTaskEither'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { State } from './State'
import { Task } from './Task'
import { TaskEither, URI as TEURI } from './TaskEither'
import ReaderTaskEither = RTE.ReaderTaskEither
import Either = E.Either
import Reader = R.Reader
/**
 * @category model
 * @since 2.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
  (s: S): ReaderTaskEither<R, E, [A, S]>
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const left: <S, R, E = never, A = never>(e: E) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const right: <S, R, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function rightTask<S, R, E = never, A = never>(ma: Task<A>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function leftTask<S, R, E = never, A = never>(me: Task<E>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function rightReader<S, R, E = never, A = never>(ma: Reader<R, A>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function leftReader<S, R, E = never, A = never>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function rightIO<S, R, E = never, A = never>(ma: IO<A>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function leftIO<S, R, E = never, A = never>(me: IO<E>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightState: <S, R, E = never, A = never>(ma: State<S, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftState: <S, R, E = never, A = never>(me: State<S, E>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromEither: FromEither4<URI>['fromEither']
/**
 * @category natural transformations
 * @since 2.11.0
 */
export declare const fromReader: FromReader4<URI>['fromReader']
/**
 * @category natural transformations
 * @since 2.7.0
 */
export declare const fromIO: FromIO4<URI>['fromIO']
/**
 * @category natural transformations
 * @since 2.7.0
 */
export declare const fromTask: FromTask4<URI>['fromTask']
/**
 * @category natural transformations
 * @since 2.10.0
 */
export declare const fromState: FromState4<URI>['fromState']
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromTaskEither: NaturalTransformation24<TEURI, URI>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromIOEither: NaturalTransformation24<IEURI, URI>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromReaderEither: NaturalTransformation34<REURI, URI>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromReaderTaskEither: NaturalTransformation34<RTE.URI, URI>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const local: <R2, R1>(
  f: (r2: R2) => R1
) => <S, E, A>(ma: StateReaderTaskEither<S, R1, E, A>) => StateReaderTaskEither<S, R2, E, A>
/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksStateReaderTaskEitherW: <R1, S, R2, E, A>(
  f: (r1: R1) => StateReaderTaskEither<S, R2, E, A>
) => StateReaderTaskEither<S, R1 & R2, E, A>
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksStateReaderTaskEither: <R, S, E, A>(
  f: (r: R) => StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, A>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromIOEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => IOEither<E, B>
) => <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E2 | E1, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromTaskEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => TaskEither<E, B>
) => <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E2 | E1, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromReaderTaskEitherK: <R, E, A extends readonly unknown[], B>(
  f: (...a: A) => RTE.ReaderTaskEither<R, E, B>
) => <S>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainReaderTaskEitherKW: <R, E2, A, B>(
  f: (a: A) => RTE.ReaderTaskEither<R, E2, B>
) => <S, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E2 | E1, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainReaderTaskEitherK: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => <S>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <S, R>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, G, B>
/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
export declare const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, G, A>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <S, R, E, A>(
  fa: StateReaderTaskEither<S, R, E, A>
) => <B>(fab: StateReaderTaskEither<S, R, E, (a: A) => B>) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export declare const apW: <S, R2, E2, A>(
  fa: StateReaderTaskEither<S, R2, E2, A>
) => <R1, E1, B>(fab: StateReaderTaskEither<S, R1, E1, (a: A) => B>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
/**
 * @category Pointed
 * @since 2.7.0
 */
export declare const of: <S, R, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export declare const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export declare const chainW: <S, R2, E2, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const flattenW: <S, R1, E1, R2, E2, A>(
  mma: StateReaderTaskEither<S, R1, E1, StateReaderTaskEither<S, R2, E2, A>>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <S, R, E, A>(
  mma: StateReaderTaskEither<S, R, E, StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export declare const altW: <S, R2, E2, B>(
  that: () => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1, A>(fa: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E2, B | A>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.6.2
 */
export declare const alt: <S, R, E, A>(
  that: Lazy<StateReaderTaskEither<S, R, E, A>>
) => (fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category MonadThrow
 * @since 2.7.0
 */
export declare const throwError: MonadThrow4<URI>['throwError']
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'StateReaderTaskEither'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind4<S, R, E, A> {
    readonly [URI]: StateReaderTaskEither<S, R, E, A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor4<URI>
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <S, R, E, B>(fab: StateReaderTaskEither<S, R, E, (a: A) => B>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply4<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apFirst: <S, R, E, B>(
  second: StateReaderTaskEither<S, R, E, B>
) => <A>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apFirstW: <S, R2, E2, A, B>(
  second: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(first: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <S, R, E, B>(
  second: StateReaderTaskEither<S, R, E, B>
) => <A>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apSecondW: <S, R2, E2, A, B>(
  second: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(first: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain4<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromState: FromState4<URI>
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const get: <S, R, E = never>() => StateReaderTaskEither<S, R, E, S>
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const put: <S, R, E = never>(s: S) => StateReaderTaskEither<S, R, E, void>
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const modify: <S, R, E = never>(f: Endomorphism<S>) => StateReaderTaskEither<S, R, E, void>
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const gets: <S, R, E = never, A = never>(f: (s: S) => A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromStateK: <A extends ReadonlyArray<unknown>, S, B>(
  f: (...a: A) => State<S, B>
) => <R, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainStateK: <A, S, B>(
  f: (a: A) => State<S, B>
) => <R, E = never>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadThrow: MonadThrow4<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const chainFirst: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
export declare const chainFirstW: <S, R2, E2, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor4<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt4<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromReader: FromReader4<URI>
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const ask: <S, R, E = never>() => StateReaderTaskEither<S, R, E, R>
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asks: <S, R, A, E = never>(f: (r: R) => A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <S, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <S, E = never>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`chainReaderK`](#chainReaderK).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <S, R2, E = never>(ma: StateReaderTaskEither<S, R2, E, A>) => StateReaderTaskEither<S, R1 & R2, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <S, E = never>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <S, R2, E = never>(ma: StateReaderTaskEither<S, R2, E, A>) => StateReaderTaskEither<S, R2, E, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither4<URI>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromOption: <E>(onNone: Lazy<E>) => NaturalTransformation14C<OURI, URI, E>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: Lazy<E>
) => <A extends readonly unknown[], B>(
  f: (...a: A) => import('./Option').Option<B>
) => <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainOptionK: <E>(
  onNone: Lazy<E>
) => <A, B>(
  f: (a: A) => import('./Option').Option<B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, A>
/**
 * @category constructors
 * @since 2.4.4
 */
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    a: A
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R, B extends A>(b: B) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderTaskEither<S, R, E, A>
}
/**
 * @category combinators
 * @since 2.4.4
 */
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R, B extends A>(
    mb: StateReaderTaskEither<S, R, E, B>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, A>
}
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
export declare const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1, B extends A>(
    mb: StateReaderTaskEither<S, R, E1, B>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, A>
}
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO4<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => IO<B>
) => <S, R, E>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainIOK: <A, B>(
  f: (a: A) => IO<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(
  f: (a: A) => IO<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask4<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromTaskK: <A extends readonly unknown[], B>(
  f: (...a: A) => Task<B>
) => <S, R, E>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainTaskK: <A, B>(
  f: (a: A) => Task<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(
  f: (a: A) => Task<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
export declare const evaluate: <S>(
  s: S
) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
export declare const execute: <S>(s: S) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, S>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <S, R, E, A>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, { readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, S, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (
  ma: StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<
  S,
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, S, R, E, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R, E, B>
) => (
  fa: StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<
  S,
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, S, R, E, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, S, R, E, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: readonly A[]) => StateReaderTaskEither<S, R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <S, R, E, A, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: readonly A[]) => StateReaderTaskEither<S, R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <S, R, E, A>(
  arr: ReadonlyArray<StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const stateReaderTaskEither: Monad4<URI> &
  Bifunctor4<URI> &
  Alt4<URI> &
  MonadTask4<URI> &
  MonadThrow4<URI>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const stateReaderTaskEitherSeq: typeof stateReaderTaskEither
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export declare const evalState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, A>
/**
 * Use [`execute`](#execute) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export declare const execState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, S>
/**
 * @since 2.0.0
 * @deprecated
 */
export declare function run<S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S, r: R): Promise<Either<E, [A, S]>>
