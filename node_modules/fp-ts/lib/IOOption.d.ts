/**
 * @since 2.12.0
 */
import { Alt1 } from './Alt'
import { Alternative1 } from './Alternative'
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import { Chain1 } from './Chain'
import { Compactable1 } from './Compactable'
import { Either } from './Either'
import { Filterable1 } from './Filterable'
import { FromEither1 } from './FromEither'
import { FromIO1 } from './FromIO'
import { Lazy } from './function'
import { Functor1 } from './Functor'
import { Monad1 } from './Monad'
import { MonadIO1 } from './MonadIO'
import { NaturalTransformation11, NaturalTransformation21 } from './NaturalTransformation'
import * as O from './Option'
import { Pointed1 } from './Pointed'
import { Predicate } from './Predicate'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Separated } from './Separated'
import * as I from './IO'
import { URI as IEURI } from './IOEither'
import { Zero1 } from './Zero'
import IO = I.IO
import Option = O.Option
/**
 * @category model
 * @since 2.12.0
 */
export interface IOOption<A> extends IO<Option<A>> {}
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const some: <A>(a: A) => IOOption<A>
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => IOOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(b: B) => IOOption<B>
  <A>(predicate: Predicate<A>): (a: A) => IOOption<A>
}
/**
 * @category natural transformations
 * @since 2.12.0
 */
export declare const fromOption: NaturalTransformation11<O.URI, URI>
/**
 * @category natural transformations
 * @since 2.12.0
 */
export declare const fromEither: FromEither1<URI>['fromEither']
/**
 * @category natural transformations
 * @since 2.12.0
 */
export declare const fromIO: FromIO1<URI>['fromIO']
/**
 * @category natural transformations
 * @since 2.12.0
 */
export declare const fromIOEither: NaturalTransformation21<IEURI, URI>
/**
 * @category destructors
 * @since 2.12.0
 */
export declare const match: <B, A>(onNone: () => B, onSome: (a: A) => B) => (ma: IOOption<A>) => IO<B>
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.12.0
 */
export declare const matchW: <B, A, C>(onNone: () => B, onSome: (a: A) => C) => (ma: IOOption<A>) => IO<B | C>
/**
 * @category destructors
 * @since 2.12.0
 */
export declare const matchE: <B, A>(onNone: () => IO<B>, onSome: (a: A) => IO<B>) => (ma: IOOption<A>) => IO<B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.12.0
 */
export declare const fold: <B, A>(onNone: () => I.IO<B>, onSome: (a: A) => I.IO<B>) => (ma: IOOption<A>) => I.IO<B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.12.0
 */
export declare const matchEW: <B, C, A>(onNone: () => IO<B>, onSome: (a: A) => IO<C>) => (ma: IOOption<A>) => IO<B | C>
/**
 * @category destructors
 * @since 2.12.0
 */
export declare const getOrElse: <A>(onNone: Lazy<IO<A>>) => (fa: IOOption<A>) => IO<A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.12.0
 */
export declare const getOrElseW: <B>(onNone: Lazy<IO<B>>) => <A>(ma: IOOption<A>) => IO<A | B>
/**
 * @category destructors
 * @since 2.12.0
 */
export declare const toUndefined: <A>(ma: IOOption<A>) => IO<A | undefined>
/**
 * @category destructors
 * @since 2.12.0
 */
export declare const toNullable: <A>(ma: IOOption<A>) => IO<A | null>
/**
 * @category interop
 * @since 2.12.0
 */
export declare const fromNullable: <A>(a: A) => IOOption<NonNullable<A>>
/**
 * @category interop
 * @since 2.12.0
 */
export declare const fromNullableK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => IOOption<NonNullable<B>>
/**
 * @category interop
 * @since 2.12.0
 */
export declare const chainNullableK: <A, B>(
  f: (a: A) => B | null | undefined
) => (ma: IOOption<A>) => IOOption<NonNullable<B>>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const fromOptionK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => (...a: A) => IOOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainOptionK: <A, B>(f: (a: A) => Option<B>) => (ma: IOOption<A>) => IOOption<B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.12.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: IOOption<A>) => IOOption<B>
/**
 * @category Apply
 * @since 2.12.0
 */
export declare const ap: <A>(fa: IOOption<A>) => <B>(fab: IOOption<(a: A) => B>) => IOOption<B>
/**
 * @category Pointed
 * @since 2.12.0
 */
export declare const of: Pointed1<URI>['of']
/**
 * @category Monad
 * @since 2.12.0
 */
export declare const chain: <A, B>(f: (a: A) => IOOption<B>) => (ma: IOOption<A>) => IOOption<B>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const flatten: <A>(mma: IOOption<IOOption<A>>) => IOOption<A>
/**
 * @category Alt
 * @since 2.12.0
 */
export declare const alt: <A>(second: Lazy<IOOption<A>>) => (first: IOOption<A>) => IOOption<A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.12.0
 */
export declare const altW: <B>(second: Lazy<IOOption<B>>) => <A>(first: IOOption<A>) => IOOption<A | B>
/**
 * @category Zero
 * @since 2.12.0
 */
export declare const zero: Zero1<URI>['zero']
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const none: IOOption<never>
/**
 * @category Compactable
 * @since 2.12.0
 */
export declare const compact: Compactable1<URI>['compact']
/**
 * @category Compactable
 * @since 2.12.0
 */
export declare const separate: Compactable1<URI>['separate']
/**
 * @category Filterable
 * @since 2.12.0
 */
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: IOOption<A>) => IOOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: IOOption<B>) => IOOption<B>
  <A>(predicate: Predicate<A>): (fa: IOOption<A>) => IOOption<A>
}
/**
 * @category Filterable
 * @since 2.12.0
 */
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (fga: IOOption<A>) => IOOption<B>
/**
 * @category Filterable
 * @since 2.12.0
 */
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: IOOption<A>) => Separated<IOOption<A>, IOOption<B>>
  <A>(predicate: Predicate<A>): <B extends A>(fb: IOOption<B>) => Separated<IOOption<B>, IOOption<B>>
  <A>(predicate: Predicate<A>): (fa: IOOption<A>) => Separated<IOOption<A>, IOOption<A>>
}
/**
 * @category Filterable
 * @since 2.12.0
 */
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: IOOption<A>) => Separated<IOOption<B>, IOOption<C>>
/**
 * @category instances
 * @since 2.12.0
 */
declare const URI = 'IOOption'
/**
 * @category instances
 * @since 2.12.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: IOOption<A>
  }
}
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Functor: Functor1<URI>
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const flap: <A>(a: A) => <B>(fab: IOOption<(a: A) => B>) => IOOption<B>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Pointed: Pointed1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Apply: Apply1<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apFirst: <B>(second: IOOption<B>) => <A>(first: IOOption<A>) => IOOption<A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const apSecond: <B>(second: IOOption<B>) => <A>(first: IOOption<A>) => IOOption<B>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Applicative: Applicative1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Chain: Chain1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => IOOption<B>) => (first: IOOption<A>) => IOOption<A>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Alt: Alt1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Zero: Zero1<URI>
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const guard: (b: boolean) => IOOption<void>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Alternative: Alternative1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Monad: Monad1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const MonadIO: MonadIO1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Compactable: Compactable1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Filterable: Filterable1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const FromIO: FromIO1<URI>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(f: (...a: A) => I.IO<B>) => (...a: A) => IOOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainIOK: <A, B>(f: (a: A) => I.IO<B>) => (first: IOOption<A>) => IOOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstIOK: <A, B>(f: (a: A) => I.IO<B>) => (first: IOOption<A>) => IOOption<A>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const FromEither: FromEither1<URI>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const fromEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => IOOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: IOOption<A>) => IOOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: IOOption<A>) => IOOption<A>
/**
 * @since 2.12.0
 */
export declare const Do: IOOption<{}>
/**
 * @since 2.12.0
 */
export declare const bindTo: <N extends string>(name: N) => <A>(fa: IOOption<A>) => IOOption<{ readonly [K in N]: A }>
/**
 * @since 2.12.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => IOOption<B>
) => (ma: IOOption<A>) => IOOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.12.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: IOOption<B>
) => (fa: IOOption<A>) => IOOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.12.0
 */
export declare const ApT: IOOption<readonly []>
/**
 * @since 2.12.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IOOption<B>
) => (as: ReadonlyNonEmptyArray<A>) => IOOption<ReadonlyNonEmptyArray<B>>
/**
 * @since 2.12.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IOOption<B>
) => (as: readonly A[]) => IOOption<readonly B[]>
export {}
