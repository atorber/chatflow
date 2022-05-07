/**
 * `IOEither<E, A>` represents a synchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `E`. If you want to represent a synchronous computation that never fails, please see `IO`.
 *
 * @since 2.0.0
 */
import { Alt2, Alt2C } from './Alt'
import { Applicative2, Applicative2C } from './Applicative'
import { Apply2 } from './Apply'
import { Bifunctor2 } from './Bifunctor'
import { Chain2 } from './Chain'
import { Compactable2C } from './Compactable'
import * as E from './Either'
import { Filterable2C } from './Filterable'
import { FromEither2 } from './FromEither'
import { FromIO2 } from './FromIO'
import { Lazy } from './function'
import { Functor2 } from './Functor'
import * as I from './IO'
import { Monad2, Monad2C } from './Monad'
import { MonadIO2, MonadIO2C } from './MonadIO'
import { MonadThrow2, MonadThrow2C } from './MonadThrow'
import { Monoid } from './Monoid'
import { Pointed2 } from './Pointed'
import { Predicate } from './Predicate'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import Either = E.Either
import IO = I.IO
/**
 * @category model
 * @since 2.0.0
 */
export interface IOEither<E, A> extends IO<Either<E, A>> {}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const left: <E = never, A = never>(l: E) => IOEither<E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const right: <E = never, A = never>(a: A) => IOEither<E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightIO: <E = never, A = never>(ma: IO<A>) => IOEither<E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftIO: <E = never, A = never>(me: IO<E>) => IOEither<E, A>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromEither: FromEither2<URI>['fromEither']
/**
 * @category natural transformations
 * @since 2.7.0
 */
export declare const fromIO: FromIO2<URI>['fromIO']
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const match: <E, B, A>(onLeft: (e: E) => B, onRight: (a: A) => B) => (ma: IOEither<E, A>) => IO<B>
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C
) => (ma: IOEither<E, A>) => IO<B | C>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const matchE: <E, A, B>(
  onLeft: (e: E) => IO<B>,
  onRight: (a: A) => IO<B>
) => (ma: IOEither<E, A>) => IO<B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
export declare const fold: <E, A, B>(
  onLeft: (e: E) => I.IO<B>,
  onRight: (a: A) => I.IO<B>
) => (ma: IOEither<E, A>) => I.IO<B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchEW: <E, B, A, C>(
  onLeft: (e: E) => IO<B>,
  onRight: (a: A) => IO<C>
) => (ma: IOEither<E, A>) => IO<B | C>
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const foldW: <E, B, A, C>(
  onLeft: (e: E) => I.IO<B>,
  onRight: (a: A) => I.IO<C>
) => (ma: IOEither<E, A>) => I.IO<B | C>
/**
 * @category destructors
 * @since 2.0.0
 */
export declare const getOrElse: <E, A>(onLeft: (e: E) => IO<A>) => (ma: IOEither<E, A>) => IO<A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
export declare const getOrElseW: <E, B>(onLeft: (e: E) => IO<B>) => <A>(ma: IOEither<E, A>) => IO<A | B>
/**
 * Constructs a new `IOEither` from a function that performs a side effect and might throw
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @category interop
 * @since 2.0.0
 */
export declare const tryCatch: <E, A>(f: Lazy<A>, onThrow: (reason: unknown) => E) => IOEither<E, A>
/**
 * Converts a function that may throw to one returning a `IOEither`.
 *
 * @category interop
 * @since 2.10.0
 */
export declare const tryCatchK: <A extends readonly unknown[], B, E>(
  f: (...a: A) => B,
  onThrow: (reason: unknown) => E
) => (...a: A) => IOEither<E, B>
/**
 * @category interop
 * @since 2.10.0
 */
export declare const toUnion: <E, A>(fa: IOEither<E, A>) => IO<E | A>
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const orElse: <E1, A, E2>(onLeft: (e: E1) => IOEither<E2, A>) => (ma: IOEither<E1, A>) => IOEither<E2, A>
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const orElseW: <E1, E2, B>(
  onLeft: (e: E1) => IOEither<E2, B>
) => <A>(ma: IOEither<E1, A>) => IOEither<E2, A | B>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orElseFirst: <E, B>(onLeft: (e: E) => IOEither<E, B>) => <A>(ma: IOEither<E, A>) => IOEither<E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orElseFirstW: <E1, E2, B>(
  onLeft: (e: E1) => IOEither<E2, B>
) => <A>(ma: IOEither<E1, A>) => IOEither<E1 | E2, A>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const orElseFirstIOK: <E, B>(onLeft: (e: E) => IO<B>) => <A>(ma: IOEither<E, A>) => IOEither<E, A>
/**
 * @category combinators
 * @since 2.11.0
 */
export declare const orLeft: <E1, E2>(onLeft: (e: E1) => IO<E2>) => <A>(fa: IOEither<E1, A>) => IOEither<E2, A>
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const swap: <E, A>(ma: IOEither<E, A>) => IOEither<A, E>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: IOEither<E, A>) => IOEither<E, B>
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
export declare const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: IOEither<E, A>) => IOEither<G, B>
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: IOEither<E, A>) => IOEither<G, A>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <E, A>(fa: IOEither<E, A>) => <B>(fab: IOEither<E, (a: A) => B>) => IOEither<E, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export declare const apW: <E2, A>(
  fa: IOEither<E2, A>
) => <E1, B>(fab: IOEither<E1, (a: A) => B>) => IOEither<E1 | E2, B>
/**
 * @category Pointed
 * @since 2.8.5
 */
export declare const of: <E = never, A = never>(a: A) => IOEither<E, A>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export declare const chain: <E, A, B>(f: (a: A) => IOEither<E, B>) => (ma: IOEither<E, A>) => IOEither<E, B>
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export declare const chainW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <E1>(ma: IOEither<E1, A>) => IOEither<E1 | E2, B>
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export declare const flattenW: <E1, E2, A>(mma: IOEither<E1, IOEither<E2, A>>) => IOEither<E1 | E2, A>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <E, A>(mma: IOEither<E, IOEither<E, A>>) => IOEither<E, A>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
export declare const alt: <E, A>(that: Lazy<IOEither<E, A>>) => (fa: IOEither<E, A>) => IOEither<E, A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export declare const altW: <E2, B>(that: Lazy<IOEither<E2, B>>) => <E1, A>(fa: IOEither<E1, A>) => IOEither<E2, A | B>
/**
 * @category MonadThrow
 * @since 2.7.0
 */
export declare const throwError: MonadThrow2<URI>['throwError']
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'IOEither'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: IOEither<E, A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getApplicativeIOValidation<E>(S: Semigroup<E>): Applicative2C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getAltIOValidation<E>(S: Semigroup<E>): Alt2C<URI, E>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getCompactable: <E>(M: Monoid<E>) => Compactable2C<'IOEither', E>
/**
 * @category instances
 * @since 2.1.0
 */
export declare function getFilterable<E>(M: Monoid<E>): Filterable2C<URI, E>
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
export declare const flap: <A>(a: A) => <E, B>(fab: IOEither<E, (a: A) => B>) => IOEither<E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor2<URI>
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
 * @since 2.0.0
 */
export declare const apFirst: <E, B>(second: IOEither<E, B>) => <A>(first: IOEither<E, A>) => IOEither<E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apFirstW: <E2, A, B>(
  second: IOEither<E2, B>
) => <E1>(first: IOEither<E1, A>) => IOEither<E1 | E2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <E, B>(second: IOEither<E, B>) => <A>(first: IOEither<E, A>) => IOEither<E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apSecondW: <E2, A, B>(
  second: IOEither<E2, B>
) => <E1>(first: IOEither<E1, A>) => IOEither<E1 | E2, B>
/**
 * @category instances
 * @since 2.8.4
 */
export declare const ApplicativePar: Applicative2<URI>
/**
 * @category instances
 * @since 2.8.4
 */
export declare const ApplicativeSeq: Applicative2<URI>
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
export declare const chainFirst: <E, A, B>(f: (a: A) => IOEither<E, B>) => (ma: IOEither<E, A>) => IOEither<E, A>
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
export declare const chainFirstW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <E1>(ma: IOEither<E1, A>) => IOEither<E1 | E2, A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const MonadIO: MonadIO2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const MonadThrow: MonadThrow2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO2<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => I.IO<B>
) => <E>(...a: A) => IOEither<E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainIOK: <A, B>(f: (a: A) => I.IO<B>) => <E>(first: IOEither<E, A>) => IOEither<E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(f: (a: A) => I.IO<B>) => <E>(first: IOEither<E, A>) => IOEither<E, A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither2<URI>
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromOption: <E>(
  onNone: Lazy<E>
) => import('./NaturalTransformation').NaturalTransformation12C<'Option', 'IOEither', E>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: Lazy<E>
) => <A extends readonly unknown[], B>(f: (...a: A) => import('./Option').Option<B>) => (...a: A) => IOEither<E, B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainOptionK: <E>(
  onNone: Lazy<E>
) => <A, B>(f: (a: A) => import('./Option').Option<B>) => (ma: IOEither<E, A>) => IOEither<E, B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainEitherK: <E, A, B>(f: (a: A) => E.Either<E, B>) => (ma: IOEither<E, A>) => IOEither<E, B>
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export declare const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <E1>(ma: IOEither<E1, A>) => IOEither<E1 | E2, B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <A, E, B>(f: (a: A) => E.Either<E, B>) => (ma: IOEither<E, A>) => IOEither<E, A>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => E.Either<E2, B>
) => <E1>(ma: IOEither<E1, A>) => IOEither<E1 | E2, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => IOEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(b: B) => IOEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => IOEither<E, A>
}
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: IOEither<E, A>) => IOEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(mb: IOEither<E, B>) => IOEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: IOEither<E, A>) => IOEither<E, A>
}
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
export declare const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <E1>(
    ma: IOEither<E1, A>
  ) => IOEither<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1, B extends A>(
    mb: IOEither<E1, B>
  ) => IOEither<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1>(ma: IOEither<E1, A>) => IOEither<E1 | E2, A>
}
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => (...a: A) => IOEither<E, B>
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
export declare const bracket: <E, A, B>(
  acquire: IOEither<E, A>,
  use: (a: A) => IOEither<E, B>,
  release: (a: A, e: E.Either<E, B>) => IOEither<E, void>
) => IOEither<E, B>
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
export declare const bracketW: <E1, A, E2, B, E3>(
  acquire: IOEither<E1, A>,
  use: (a: A) => IOEither<E2, B>,
  release: (a: A, e: E.Either<E2, B>) => IOEither<E3, void>
) => IOEither<E1 | E2 | E3, B>
/**
 * @since 2.9.0
 */
export declare const Do: IOEither<never, {}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(fa: IOEither<E, A>) => IOEither<E, { readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => IOEither<E, B>
) => (ma: IOEither<E, A>) => IOEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => IOEither<E2, B>
) => <E1>(
  fa: IOEither<E1, A>
) => IOEither<
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: IOEither<E, B>
) => (fa: IOEither<E, A>) => IOEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, E2, B>(
  name: Exclude<N, keyof A>,
  fb: IOEither<E2, B>
) => <E1>(
  fa: IOEither<E1, A>
) => IOEither<
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: IOEither<never, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, E, B>(
  f: (index: number, a: A) => IOEither<E, B>
) => (as: ReadonlyNonEmptyArray<A>) => IOEither<E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, E, B>(
  f: (index: number, a: A) => IOEither<E, B>
) => (as: readonly A[]) => IOEither<E, readonly B[]>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <A, E, B>(
  f: (index: number, a: A) => IOEither<E, B>
) => (as: ReadonlyNonEmptyArray<A>) => IOEither<E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <A, E, B>(
  f: (index: number, a: A) => IOEither<E, B>
) => (as: readonly A[]) => IOEither<E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <A, E, B>(
  f: (index: number, a: A) => IOEither<E, B>
) => (as: ReadonlyArray<A>) => IOEither<E, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <A, E, B>(
  f: (a: A) => IOEither<E, B>
) => (as: readonly A[]) => IOEither<E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <E, A>(arr: ReadonlyArray<IOEither<E, A>>) => IOEither<E, ReadonlyArray<A>>
/**
 * @since 2.9.0
 */
export declare const traverseSeqArrayWithIndex: <A, E, B>(
  f: (index: number, a: A) => IOEither<E, B>
) => (as: ReadonlyArray<A>) => IOEither<E, ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseSeqArray: <A, E, B>(
  f: (a: A) => IOEither<E, B>
) => (as: readonly A[]) => IOEither<E, readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceSeqArray: <E, A>(arr: ReadonlyArray<IOEither<E, A>>) => IOEither<E, ReadonlyArray<A>>
/**
 * Use [`ApplicativePar`](#applicativepar) instead
 *
 * @since 2.7.0
 * @category instances
 * @deprecated
 */
export declare const Applicative: Applicative2<URI>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const ioEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadIO2<URI> & MonadThrow2<URI>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplySemigroup: <E, A>(S: Semigroup<A>) => Semigroup<IOEither<E, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplyMonoid: <E, A>(M: Monoid<A>) => Monoid<IOEither<E, A>>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <E, A>(S: Semigroup<A>) => Semigroup<IOEither<E, A>>
/**
 * Use [`getApplicativeIOValidation`](#getapplicativeiovalidation) and [`getAltIOValidation`](#getaltiovalidation).
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare function getIOValidation<E>(
  SE: Semigroup<E>
): Monad2C<URI, E> & Bifunctor2<URI> & Alt2C<URI, E> & MonadIO2C<URI, E> & MonadThrow2C<URI, E>
