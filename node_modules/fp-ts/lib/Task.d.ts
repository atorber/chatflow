/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import { Chain1 } from './Chain'
import { FromIO1 } from './FromIO'
import { FromTask1 } from './FromTask'
import { Functor1 } from './Functor'
import { Monad1 } from './Monad'
import { MonadIO1 } from './MonadIO'
import { MonadTask1 } from './MonadTask'
import { Monoid } from './Monoid'
import { Pointed1 } from './Pointed'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Semigroup } from './Semigroup'
/**
 * @category model
 * @since 2.0.0
 */
export interface Task<A> {
  (): Promise<A>
}
/**
 * @category natural transformations
 * @since 2.0.0
 */
export declare const fromIO: FromIO1<URI>['fromIO']
/**
 * Creates a task that will complete after a time delay
 *
 * @example
 * import { sequenceT } from 'fp-ts/Apply'
 * import * as T from 'fp-ts/Task'
 * import { takeRight } from 'fp-ts/Array'
 *
 * async function test() {
 *   const log: Array<string> = []
 *   const append = (message: string): T.Task<void> =>
 *     T.fromIO(() => {
 *       log.push(message)
 *     })
 *   const fa = append('a')
 *   const fb = T.delay(20)(append('b'))
 *   const fc = T.delay(10)(append('c'))
 *   const fd = append('d')
 *   await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()
 *   assert.deepStrictEqual(takeRight(2)(log), ['c', 'b'])
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.0.0
 */
export declare function delay(millis: number): <A>(ma: Task<A>) => Task<A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: Task<A>) => Task<B>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <A>(fa: Task<A>) => <B>(fab: Task<(a: A) => B>) => Task<B>
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
export declare const chain: <A, B>(f: (a: A) => Task<B>) => (ma: Task<A>) => Task<B>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <A>(mma: Task<Task<A>>) => Task<A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'Task'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Task<A>
  }
}
/**
 * Monoid returning the first completed task.
 *
 * Note: uses `Promise.race` internally.
 *
 * @example
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const S = T.getRaceMonoid<string>()
 *   const fa = T.delay(20)(T.of('a'))
 *   const fb = T.delay(10)(T.of('b'))
 *   assert.deepStrictEqual(await S.concat(fa, fb)(), 'b')
 * }
 *
 * test()
 *
 * @category instances
 * @since 2.0.0
 */
export declare function getRaceMonoid<A = never>(): Monoid<Task<A>>
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
export declare const flap: <A>(a: A) => <B>(fab: Task<(a: A) => B>) => Task<B>
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
 * @since 2.0.0
 */
export declare const apFirst: <B>(second: Task<B>) => <A>(first: Task<A>) => Task<A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <B>(second: Task<B>) => <A>(first: Task<A>) => Task<B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativePar: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const ApplySeq: Apply1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativeSeq: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain1<URI>
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
 * @category FromTask
 * @since 2.7.0
 * @deprecated
 */
export declare const fromTask: FromTask1<URI>['fromTask']
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => Task<B>) => (first: Task<A>) => Task<A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO1<URI>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const fromIOK: <A extends readonly unknown[], B>(
  f: (...a: A) => import('./IO').IO<B>
) => (...a: A) => Task<B>
/**
 * @category combinators
 * @since 2.4.0
 */
export declare const chainIOK: <A, B>(f: (a: A) => import('./IO').IO<B>) => (first: Task<A>) => Task<B>
/**
 * @category combinators
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(f: (a: A) => import('./IO').IO<B>) => (first: Task<A>) => Task<A>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask1<URI>
/**
 * A `Task` that never completes.
 *
 * @since 2.0.0
 */
export declare const never: Task<never>
/**
 * @since 2.9.0
 */
export declare const Do: Task<{}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(name: N) => <A>(fa: Task<A>) => Task<{ readonly [K in N]: A }>
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Task<B>
) => (ma: Task<A>) => Task<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: Task<B>
) => (fa: Task<A>) => Task<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.11.0
 */
export declare const ApT: Task<readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Task<B>
) => (as: ReadonlyNonEmptyArray<A>) => Task<ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Task<B>
) => (as: readonly A[]) => Task<readonly B[]>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <A, B>(
  f: (index: number, a: A) => Task<B>
) => (as: ReadonlyNonEmptyArray<A>) => Task<ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <A, B>(
  f: (index: number, a: A) => Task<B>
) => (as: readonly A[]) => Task<readonly B[]>
/**
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Task<B>
) => (as: ReadonlyArray<A>) => Task<ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseArray: <A, B>(f: (a: A) => Task<B>) => (as: readonly A[]) => Task<readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceArray: <A>(arr: ReadonlyArray<Task<A>>) => Task<ReadonlyArray<A>>
/**
 * @since 2.9.0
 */
export declare const traverseSeqArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Task<B>
) => (as: ReadonlyArray<A>) => Task<ReadonlyArray<B>>
/**
 * @since 2.9.0
 */
export declare const traverseSeqArray: <A, B>(f: (a: A) => Task<B>) => (as: readonly A[]) => Task<readonly B[]>
/**
 * @since 2.9.0
 */
export declare const sequenceSeqArray: <A>(arr: ReadonlyArray<Task<A>>) => Task<ReadonlyArray<A>>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const task: Monad1<URI> & MonadTask1<URI>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const taskSeq: typeof task
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <A>(S: Semigroup<A>) => Semigroup<Task<A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * Lift a monoid into 'Task', the inner values are concatenated using the provided `Monoid`.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const getMonoid: <A>(M: Monoid<A>) => Monoid<Task<A>>
