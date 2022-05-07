/**
 * @since 2.10.0
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
import { FromTask1 } from './FromTask'
import { Lazy } from './function'
import { Functor1 } from './Functor'
import { Monad1 } from './Monad'
import { MonadIO1 } from './MonadIO'
import { MonadTask1 } from './MonadTask'
import { NaturalTransformation11, NaturalTransformation21 } from './NaturalTransformation'
import * as O from './Option'
import { Pointed1 } from './Pointed'
import { Predicate } from './Predicate'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Separated } from './Separated'
import * as T from './Task'
import { URI as TEURI } from './TaskEither'
import { Zero1 } from './Zero'
import Task = T.Task
import Option = O.Option
/**
 * @category model
 * @since 2.10.0
 */
export interface TaskOption<A> extends Task<Option<A>> {}
/**
 * @category constructors
 * @since 2.10.0
 */
export declare const some: <A>(a: A) => TaskOption<A>
/**
 * @category constructors
 * @since 2.10.0
 */
export declare const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => TaskOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(b: B) => TaskOption<B>
  <A>(predicate: Predicate<A>): (a: A) => TaskOption<A>
}
/**
 * @category natural transformations
 * @since 2.10.0
 */
export declare const fromOption: NaturalTransformation11<O.URI, URI>
/**
 * @category natural transformations
 * @since 2.10.0
 */
export declare const fromEither: FromEither1<URI>['fromEither']
/**
 * @category natural transformations
 * @since 2.10.0
 */
export declare const fromIO: FromIO1<URI>['fromIO']
/**
 * @category natural transformations
 * @since 2.10.0
 */
export declare const fromTask: FromTask1<URI>['fromTask']
/**
 * @category natural transformations
 * @since 2.11.0
 */
export declare const fromTaskEither: NaturalTransformation21<TEURI, URI>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const match: <B, A>(onNone: () => B, onSome: (a: A) => B) => (ma: TaskOption<A>) => Task<B>
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchW: <B, A, C>(onNone: () => B, onSome: (a: A) => C) => (ma: TaskOption<A>) => Task<B | C>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const matchE: <B, A>(onNone: () => Task<B>, onSome: (a: A) => Task<B>) => (ma: TaskOption<A>) => Task<B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const fold: <B, A>(
  onNone: () => T.Task<B>,
  onSome: (a: A) => T.Task<B>
) => (ma: TaskOption<A>) => T.Task<B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const matchEW: <B, C, A>(
  onNone: () => Task<B>,
  onSome: (a: A) => Task<C>
) => (ma: TaskOption<A>) => Task<B | C>
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const foldW: <B, C, A>(
  onNone: () => T.Task<B>,
  onSome: (a: A) => T.Task<C>
) => (ma: TaskOption<A>) => T.Task<B | C>
/**
 * @category destructors
 * @since 2.10.0
 */
export declare const getOrElse: <A>(onNone: Lazy<Task<A>>) => (fa: TaskOption<A>) => Task<A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.10.0
 */
export declare const getOrElseW: <B>(onNone: Lazy<Task<B>>) => <A>(ma: TaskOption<A>) => Task<A | B>
/**
 * @category interop
 * @since 2.10.0
 */
export declare const fromNullable: <A>(a: A) => TaskOption<NonNullable<A>>
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Option` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @category interop
 * @since 2.10.0
 */
export declare const tryCatch: <A>(f: Lazy<Promise<A>>) => TaskOption<A>
/**
 * Converts a function returning a `Promise` to one returning a `TaskOption`.
 *
 * @category interop
 * @since 2.10.0
 */
export declare const tryCatchK: <A extends readonly unknown[], B>(
  f: (...a: A) => Promise<B>
) => (...a: A) => TaskOption<B>
/**
 * @category interop
 * @since 2.10.0
 */
export declare const fromNullableK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => TaskOption<NonNullable<B>>
/**
 * @category interop
 * @since 2.10.0
 */
export declare const chainNullableK: <A, B>(
  f: (a: A) => B | null | undefined
) => (ma: TaskOption<A>) => TaskOption<NonNullable<B>>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromOptionK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => (...a: A) => TaskOption<B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainOptionK: <A, B>(f: (a: A) => Option<B>) => (ma: TaskOption<A>) => TaskOption<B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.10.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: TaskOption<A>) => TaskOption<B>
/**
 * @category Apply
 * @since 2.10.0
 */
export declare const ap: <A>(fa: TaskOption<A>) => <B>(fab: TaskOption<(a: A) => B>) => TaskOption<B>
/**
 * @category Pointed
 * @since 2.10.0
 */
export declare const of: Pointed1<URI>['of']
/**
 * @category Monad
 * @since 2.10.0
 */
export declare const chain: <A, B>(f: (a: A) => TaskOption<B>) => (ma: TaskOption<A>) => TaskOption<B>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const flatten: <A>(mma: TaskOption<TaskOption<A>>) => TaskOption<A>
/**
 * @category Alt
 * @since 2.10.0
 */
export declare const alt: <A>(second: Lazy<TaskOption<A>>) => (first: TaskOption<A>) => TaskOption<A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.10.0
 */
export declare const altW: <B>(second: Lazy<TaskOption<B>>) => <A>(first: TaskOption<A>) => TaskOption<A | B>
/**
 * @category Zero
 * @since 2.10.0
 */
export declare const zero: Zero1<URI>['zero']
/**
 * @category constructors
 * @since 2.10.0
 */
export declare const none: TaskOption<never>
/**
 * @category Compactable
 * @since 2.10.0
 */
export declare const compact: Compactable1<URI>['compact']
/**
 * @category Compactable
 * @since 2.10.0
 */
export declare const separate: Compactable1<URI>['separate']
/**
 * @category Filterable
 * @since 2.10.0
 */
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: TaskOption<A>) => TaskOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: TaskOption<B>) => TaskOption<B>
  <A>(predicate: Predicate<A>): (fa: TaskOption<A>) => TaskOption<A>
}
/**
 * @category Filterable
 * @since 2.10.0
 */
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (fga: TaskOption<A>) => TaskOption<B>
/**
 * @category Filterable
 * @since 2.10.0
 */
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: TaskOption<A>) => Separated<TaskOption<A>, TaskOption<B>>
  <A>(predicate: Predicate<A>): <B extends A>(fb: TaskOption<B>) => Separated<TaskOption<B>, TaskOption<B>>
  <A>(predicate: Predicate<A>): (fa: TaskOption<A>) => Separated<TaskOption<A>, TaskOption<A>>
}
/**
 * @category Filterable
 * @since 2.10.0
 */
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: TaskOption<A>) => Separated<TaskOption<B>, TaskOption<C>>
/**
 * @category instances
 * @since 2.10.0
 */
declare const URI = 'TaskOption'
/**
 * @category instances
 * @since 2.10.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: TaskOption<A>
  }
}
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Functor: Functor1<URI>
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const flap: <A>(a: A) => <B>(fab: TaskOption<(a: A) => B>) => TaskOption<B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplyPar: Apply1<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const apFirst: <B>(second: TaskOption<B>) => <A>(first: TaskOption<A>) => TaskOption<A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const apSecond: <B>(second: TaskOption<B>) => <A>(first: TaskOption<A>) => TaskOption<B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplicativePar: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplySeq: Apply1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplicativeSeq: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => TaskOption<B>) => (first: TaskOption<A>) => TaskOption<A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Alt: Alt1<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const Zero: Zero1<URI>
/**
 * @category constructors
 * @since 2.11.0
 */
export declare const guard: (b: boolean) => TaskOption<void>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Alternative: Alternative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Compactable: Compactable1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Filterable: Filterable1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO1<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => import('./IO').IO<B>
) => (...a: A) => TaskOption<B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainIOK: <A, B>(f: (a: A) => import('./IO').IO<B>) => (first: TaskOption<A>) => TaskOption<B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(f: (a: A) => import('./IO').IO<B>) => (first: TaskOption<A>) => TaskOption<A>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromEither: FromEither1<URI>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const fromEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => TaskOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: TaskOption<A>) => TaskOption<B>
/**
 * @category combinators
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: TaskOption<A>) => TaskOption<A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask1<URI>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const fromTaskK: <A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => (...a: A) => TaskOption<B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainTaskK: <A, B>(f: (a: A) => T.Task<B>) => (first: TaskOption<A>) => TaskOption<B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(f: (a: A) => T.Task<B>) => (first: TaskOption<A>) => TaskOption<A>
/**
 * @since 2.10.0
 */
export declare const Do: TaskOption<{}>
/**
 * @since 2.10.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <A>(fa: TaskOption<A>) => TaskOption<{ readonly [K in N]: A }>
/**
 * @since 2.10.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => TaskOption<B>
) => (ma: TaskOption<A>) => TaskOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.10.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: TaskOption<B>
) => (fa: TaskOption<A>) => TaskOption<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.11.0
 */
export declare const ApT: TaskOption<readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => TaskOption<B>
) => (as: ReadonlyNonEmptyArray<A>) => TaskOption<ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => TaskOption<B>
) => (as: readonly A[]) => TaskOption<readonly B[]>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <A, B>(
  f: (index: number, a: A) => TaskOption<B>
) => (as: ReadonlyNonEmptyArray<A>) => TaskOption<ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <A, B>(
  f: (index: number, a: A) => TaskOption<B>
) => (as: readonly A[]) => TaskOption<readonly B[]>
/**
 * @since 2.10.0
 */
export declare const traverseArrayWithIndex: <A, B>(
  f: (index: number, a: A) => TaskOption<B>
) => (as: ReadonlyArray<A>) => TaskOption<ReadonlyArray<B>>
/**
 * @since 2.10.0
 */
export declare const traverseArray: <A, B>(
  f: (a: A) => TaskOption<B>
) => (as: ReadonlyArray<A>) => TaskOption<ReadonlyArray<B>>
/**
 * @since 2.10.0
 */
export declare const sequenceArray: <A>(as: ReadonlyArray<TaskOption<A>>) => TaskOption<ReadonlyArray<A>>
/**
 * @since 2.10.0
 */
export declare const traverseSeqArrayWithIndex: <A, B>(
  f: (index: number, a: A) => TaskOption<B>
) => (as: ReadonlyArray<A>) => TaskOption<ReadonlyArray<B>>
/**
 * @since 2.10.0
 */
export declare const traverseSeqArray: <A, B>(
  f: (a: A) => TaskOption<B>
) => (as: ReadonlyArray<A>) => TaskOption<ReadonlyArray<B>>
/**
 * @since 2.10.0
 */
export declare const sequenceSeqArray: <A>(as: ReadonlyArray<TaskOption<A>>) => TaskOption<ReadonlyArray<A>>
export {}
