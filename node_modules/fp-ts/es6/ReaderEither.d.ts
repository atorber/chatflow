/**
 * @since 2.0.0
 */
import { Alt3, Alt3C } from './Alt'
import { Applicative3, Applicative3C } from './Applicative'
import { Apply3 } from './Apply'
import { Bifunctor3 } from './Bifunctor'
import { Chain3 } from './Chain'
import { Compactable3C } from './Compactable'
import * as E from './Either'
import { Filterable3C } from './Filterable'
import { FromEither3 } from './FromEither'
import { FromReader3 } from './FromReader'
import { Lazy } from './function'
import { Functor3 } from './Functor'
import { Monad3, Monad3C } from './Monad'
import { MonadThrow3, MonadThrow3C } from './MonadThrow'
import { Monoid } from './Monoid'
import { NaturalTransformation13C } from './NaturalTransformation'
import { URI as OURI } from './Option'
import { Pointed3 } from './Pointed'
import { Predicate } from './Predicate'
import * as R from './Reader'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import Reader = R.Reader
import Either = E.Either
/**
 * @category model
 * @since 2.0.0
 */
export interface ReaderEither<R, E, A> extends Reader<R, Either<E, A>> {}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const left: <R, E = never, A = never>(e: E) => ReaderEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const right: <R, E = never, A = never>(a: A) => ReaderEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightReader: <R, E = never, A = never>(ma: Reader<R, A>) => ReaderEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftReader: <R, E = never, A = never>(me: Reader<R, E>) => ReaderEither<R, E, A>
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
 * @category destructors
 * @since 2.10.0
 */
export declare const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B
) => <R>(ma: ReaderEither<R, E, A>) => Reader<R, B>
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C
) => <R>(ma: Reader<R, Either<E, A>>) => Reader<R, B | C>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const matchE: <R, E, A, B>(
  onLeft: (e: E) => Reader<R, B>,
  onRight: (a: A) => Reader<R, B>
) => (ma: ReaderEither<R, E, A>) => Reader<R, B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
export declare const fold: <R, E, A, B>(
  onLeft: (e: E) => R.Reader<R, B>,
  onRight: (a: A) => R.Reader<R, B>
) => (ma: ReaderEither<R, E, A>) => R.Reader<R, B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchEW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => Reader<R2, B>,
  onRight: (a: A) => Reader<R3, C>
) => <R1>(ma: ReaderEither<R1, E, A>) => Reader<R1 & R2 & R3, B | C>
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const foldW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => R.Reader<R2, B>,
  onRight: (a: A) => R.Reader<R3, C>
) => <R1>(ma: ReaderEither<R1, E, A>) => R.Reader<R1 & R2 & R3, B | C>
/**
 * @category destructors
 * @since 2.0.0
 */
export declare const getOrElse: <E, R, A>(onLeft: (e: E) => Reader<R, A>) => (ma: ReaderEither<R, E, A>) => Reader<R, A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
export declare const getOrElseW: <R2, E, B>(
  onLeft: (e: E) => Reader<R2, B>
) => <R1, A>(ma: ReaderEither<R1, E, A>) => Reader<R1 & R2, A | B>
/**
 * @category interop
 * @since 2.10.0
 */
export declare const toUnion: <R, E, A>(fa: ReaderEither<R, E, A>) => Reader<R, E | A>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const local: <R2, R1>(f: (r2: R2) => R1) => <E, A>(ma: ReaderEither<R1, E, A>) => ReaderEither<R2, E, A>
/**
 * Less strict version of [`asksReaderEither`](#asksreadereither).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderEitherW: <R1, R2, E, A>(
  f: (r1: R1) => ReaderEither<R2, E, A>
) => ReaderEither<R1 & R2, E, A>
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const asksReaderEither: <R, E, A>(f: (r: R) => ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const orElse: <E1, R, E2, A>(
  onLeft: (e: E1) => ReaderEither<R, E2, A>
) => (ma: ReaderEither<R, E1, A>) => ReaderEither<R, E2, A>
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const orElseW: <E1, R1, E2, B>(
  onLeft: (e: E1) => ReaderEither<R1, E2, B>
) => <R2, A>(ma: ReaderEither<R2, E1, A>) => ReaderEither<R1 & R2, E2, A | B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orElseFirst: <E, R, B>(
  onLeft: (e: E) => ReaderEither<R, E, B>
) => <A>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orElseFirstW: <E1, R2, E2, B>(
  onLeft: (e: E1) => ReaderEither<R2, E2, B>
) => <R1, A>(ma: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orLeft: <E1, R, E2>(
  onLeft: (e: E1) => Reader<R, E2>
) => <A>(fa: ReaderEither<R, E1, A>) => ReaderEither<R, E2, A>
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const swap: <R, E, A>(ma: ReaderEither<R, E, A>) => ReaderEither<R, A, E>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R, E>(fa: ReaderEither<R, E, A>) => ReaderEither<R, E, B>
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderEither<R, E, A>) => ReaderEither<R, G, B>
/**
 * Map a function over the second type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <R, A>(fa: ReaderEither<R, E, A>) => ReaderEither<R, G, A>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <R, E, A>(
  fa: ReaderEither<R, E, A>
) => <B>(fab: ReaderEither<R, E, (a: A) => B>) => ReaderEither<R, E, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export declare const apW: <R2, E2, A>(
  fa: ReaderEither<R2, E2, A>
) => <R1, E1, B>(fab: ReaderEither<R1, E1, (a: A) => B>) => ReaderEither<R1 & R2, E1 | E2, B>
/**
 * @category Pointed
 * @since 2.8.5
 */
export declare const of: <R, E = never, A = never>(a: A) => ReaderEither<R, E, A>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export declare const chain: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B>
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export declare const chainW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, B>
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const flattenW: <R1, R2, E1, E2, A>(
  mma: ReaderEither<R1, E1, ReaderEither<R2, E2, A>>
) => ReaderEither<R1 & R2, E1 | E2, A>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <R, E, A>(mma: ReaderEither<R, E, ReaderEither<R, E, A>>) => ReaderEither<R, E, A>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
export declare const alt: <R, E, A>(
  that: () => ReaderEither<R, E, A>
) => (fa: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export declare const altW: <R2, E2, B>(
  that: () => ReaderEither<R2, E2, B>
) => <R1, E1, A>(fa: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E2, A | B>
/**
 * @category MonadThrow
 * @since 2.7.0
 */
export declare const throwError: MonadThrow3<URI>['throwError']
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'ReaderEither'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderEither<R, E, A>
  }
}
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getCompactable: <E>(M: Monoid<E>) => Compactable3C<'ReaderEither', E>
/**
 * @category instances
 * @since 2.10.0
 */
export declare function getFilterable<E>(M: Monoid<E>): Filterable3C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getApplicativeReaderValidation<E>(S: Semigroup<E>): Applicative3C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getAltReaderValidation<E>(S: Semigroup<E>): Alt3C<URI, E>
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
export declare const flap: <A>(a: A) => <R, E, B>(fab: ReaderEither<R, E, (a: A) => B>) => ReaderEither<R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply3<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apFirst: <R, E, B>(
  second: ReaderEither<R, E, B>
) => <A>(first: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * Less strict version of [`apFirst`](#apfirst)
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apFirstW: <R2, E2, A, B>(
  second: ReaderEither<R2, E2, B>
) => <R1, E1>(first: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <R, E, B>(
  second: ReaderEither<R, E, B>
) => <A>(first: ReaderEither<R, E, A>) => ReaderEither<R, E, B>
/**
 * Less strict version of [`apSecond`](#apsecond)
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apSecondW: <R2, E2, A, B>(
  second: ReaderEither<R2, E2, B>
) => <R1, E1>(first: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain3<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Monad: Monad3<URI>
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
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
export declare const chainFirstW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, A>
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
export declare const ask: <R, E = never>() => ReaderEither<R, E, R>
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const asks: <R, A, E = never>(f: (r: R) => A) => ReaderEither<R, E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <E = never>(...a: A) => ReaderEither<R, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <E = never>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B>
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R2, B>(
  f: (a: A) => Reader<R2, B>
) => <R1, E = never>(ma: ReaderEither<R1, E, A>) => ReaderEither<R1 & R2, E, B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <E = never>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <R2, E = never>(ma: ReaderEither<R2, E, A>) => ReaderEither<R1 & R2, E, A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const MonadThrow: MonadThrow3<URI>
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
) => <R>(...a: A) => ReaderEither<R, E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainOptionK: <E>(
  onNone: Lazy<E>
) => <A, B>(f: (a: A) => import('./Option').Option<B>) => <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B>
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderEither<R, E1, A>) => ReaderEither<R, E1 | E2, B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderEither<R, E1, A>) => ReaderEither<R, E1 | E2, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R, B extends A>(b: B) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderEither<R, E, A>
}
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderEither<R, E, A>
  ) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R, B extends A>(
    mb: ReaderEither<R, E, B>
  ) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
}
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
export declare const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderEither<R, E1, A>
  ) => ReaderEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1, B extends A>(
    mb: ReaderEither<R, E1, B>
  ) => ReaderEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderEither<R, E1, A>
  ) => ReaderEither<R, E1 | E2, A>
}
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <R>(...a: A) => ReaderEither<R, E, B>
/**
 * @since 2.9.0
 */
export declare const Do: ReaderEither<unknown, never, {}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <R, E, A>(fa: ReaderEither<R, E, A>) => ReaderEither<R, E, { readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderEither<R, E, A>) => ReaderEither<R, E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderEither<R1, E1, A>
) => ReaderEither<
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
  fb: ReaderEither<R, E, B>
) => (fa: ReaderEither<R, E, A>) => ReaderEither<R, E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderEither<R1, E1, A>
) => ReaderEither<
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: ReaderEither<unknown, never, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, E, B>(
  f: (index: number, a: A) => ReaderEither<R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderEither<R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, E, B>(
  f: (index: number, a: A) => ReaderEither<R, E, B>
) => (as: readonly A[]) => ReaderEither<R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, E, A, B>(
  f: (index: number, a: A) => ReaderEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderEither<R, E, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (as: readonly A[]) => ReaderEither<R, E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <R, E, A>(
  arr: ReadonlyArray<ReaderEither<R, E, A>>
) => ReaderEither<R, E, ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const readerEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI> & MonadThrow3<URI>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplySemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderEither<R, E, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplyMonoid: <R, E, A>(M: Monoid<A>) => Monoid<ReaderEither<R, E, A>>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderEither<R, E, A>>
/**
 * Use [`getApplicativeReaderValidation`](#getapplicativereadervalidation) and [`getAltReaderValidation`](#getaltreadervalidation) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare function getReaderValidation<E>(
  SE: Semigroup<E>
): Monad3C<URI, E> & Bifunctor3<URI> & Alt3C<URI, E> & MonadThrow3C<URI, E>
