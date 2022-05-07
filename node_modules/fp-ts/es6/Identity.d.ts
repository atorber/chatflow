/**
 * @since 2.0.0
 */
import { Alt1 } from './Alt'
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import { Chain1 } from './Chain'
import { ChainRec1 } from './ChainRec'
import { Comonad1 } from './Comonad'
import { Eq } from './Eq'
import { Foldable1 } from './Foldable'
import { Functor1 } from './Functor'
import { Monad1 } from './Monad'
import { Monoid } from './Monoid'
import { Pointed1 } from './Pointed'
import { Show } from './Show'
import { PipeableTraverse1, Traversable1 } from './Traversable'
/**
 * @category model
 * @since 2.0.0
 */
export declare type Identity<A> = A
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: Identity<A>) => Identity<B>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export declare const ap: <A>(fa: Identity<A>) => <B>(fab: Identity<(a: A) => B>) => Identity<B>
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
export declare const chain: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<B>
/**
 * @category Extend
 * @since 2.0.0
 */
export declare const extend: <A, B>(f: (wa: Identity<A>) => B) => (wa: Identity<A>) => Identity<B>
/**
 * @category Extract
 * @since 2.6.2
 */
export declare const extract: <A>(wa: Identity<A>) => A
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const duplicate: <A>(ma: Identity<A>) => Identity<Identity<A>>
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const flatten: <A>(mma: Identity<Identity<A>>) => Identity<A>
/**
 * @category Foldable
 * @since 2.0.0
 */
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Identity<A>) => B
/**
 * @category Foldable
 * @since 2.0.0
 */
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Identity<A>) => M
/**
 * @category Foldable
 * @since 2.0.0
 */
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Identity<A>) => B
/**
 * @since 2.6.3
 */
export declare const traverse: PipeableTraverse1<URI>
/**
 * @since 2.6.3
 */
export declare const sequence: Traversable1<URI>['sequence']
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export declare const altW: <B>(that: () => Identity<B>) => <A>(fa: Identity<A>) => Identity<A | B>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
export declare const alt: <A>(that: () => Identity<A>) => (fa: Identity<A>) => Identity<A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'Identity'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Identity<A>
  }
}
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getShow: <A>(S: Show<A>) => Show<Identity<A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getEq: <A>(E: Eq<A>) => Eq<Identity<A>>
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
export declare const flap: <A>(a: A) => <B>(fab: (a: A) => B) => B
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
export declare const apFirst: <B>(second: B) => <A>(first: A) => A
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const apSecond: <B>(second: B) => <A>(first: A) => B
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
export declare const chainFirst: <A, B>(f: (a: A) => B) => (first: A) => A
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Foldable: Foldable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Traversable: Traversable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Comonad: Comonad1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const ChainRec: ChainRec1<URI>
/**
 * @since 2.9.0
 */
export declare const Do: Identity<{}>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(name: N) => <A>(fa: A) => { readonly [K in N]: A }
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (ma: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: B
) => (fa: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const identity: Monad1<URI> &
  Foldable1<URI> &
  Traversable1<URI> &
  Alt1<URI> &
  Comonad1<URI> &
  ChainRec1<URI>
