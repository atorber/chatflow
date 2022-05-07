/**
 * @since 2.5.0
 */
import { Applicative2C } from './Applicative'
import { Apply2C } from './Apply'
import { Bifunctor2 } from './Bifunctor'
import { Chain2C } from './Chain'
import { ChainRec2C } from './ChainRec'
import { Comonad2 } from './Comonad'
import { Foldable2 } from './Foldable'
import { Functor2 } from './Functor'
import { Monad2C } from './Monad'
import { Monoid } from './Monoid'
import { Semigroup } from './Semigroup'
import { Semigroupoid2 } from './Semigroupoid'
import { PipeableTraverse2, Traversable2 } from './Traversable'
/**
 * @category destructors
 * @since 2.5.0
 */
export declare function fst<A, E>(ea: readonly [A, E]): A
/**
 * @category destructors
 * @since 2.5.0
 */
export declare function snd<A, E>(ea: readonly [A, E]): E
/**
 * @category combinators
 * @since 2.5.0
 */
export declare const swap: <A, E>(ea: readonly [A, E]) => readonly [E, A]
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getApply<S>(S: Semigroup<S>): Apply2C<URI, S>
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getApplicative<M>(M: Monoid<M>): Applicative2C<URI, M>
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getChain<S>(S: Semigroup<S>): Chain2C<URI, S>
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getMonad<M>(M: Monoid<M>): Monad2C<URI, M>
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getChainRec<M>(M: Monoid<M>): ChainRec2C<URI, M>
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.5.0
 */
export declare const bimap: <E, G, A, B>(
  mapSnd: (e: E) => G,
  mapFst: (a: A) => B
) => (fa: readonly [A, E]) => readonly [B, G]
/**
 * Map a function over the first component of a `ReadonlyTuple`.
 *
 * This is the `map` operation of the `Functor` instance.
 *
 * @category Functor
 * @since 2.10.0
 */
export declare const mapFst: <A, B>(f: (a: A) => B) => <E>(fa: readonly [A, E]) => readonly [B, E]
/**
 * Map a function over the second component of a `ReadonlyTuple`.
 *
 * This is the `mapLeft` operation of the `Bifunctor` instance.
 *
 * @category Bifunctor
 * @since 2.10.0
 */
export declare const mapSnd: <E, G>(f: (e: E) => G) => <A>(fa: readonly [A, E]) => readonly [A, G]
/**
 * @category Semigroupoid
 * @since 2.5.0
 */
export declare const compose: <A, B>(ab: readonly [B, A]) => <C>(bc: readonly [C, B]) => readonly [C, A]
/**
 * @category Extend
 * @since 2.5.0
 */
export declare const extend: <E, A, B>(f: (wa: readonly [A, E]) => B) => (wa: readonly [A, E]) => readonly [B, E]
/**
 * @category Extract
 * @since 2.6.2
 */
export declare const extract: <E, A>(wa: readonly [A, E]) => A
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
export declare const duplicate: <E, A>(wa: readonly [A, E]) => readonly [readonly [A, E], E]
/**
 * @category Foldable
 * @since 2.5.0
 */
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: readonly [A, E]) => B
/**
 * @category Foldable
 * @since 2.5.0
 */
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: readonly [A, E]) => M
/**
 * @category Foldable
 * @since 2.5.0
 */
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: readonly [A, E]) => B
/**
 * @since 2.6.3
 */
export declare const traverse: PipeableTraverse2<URI>
/**
 * @since 2.6.3
 */
export declare const sequence: Traversable2<URI>['sequence']
/**
 * @category instances
 * @since 2.5.0
 */
export declare const URI = 'ReadonlyTuple'
/**
 * @category instances
 * @since 2.5.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: readonly [A, E]
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
export declare const flap: <A>(a: A) => <E, B>(fab: readonly [(a: A) => B, E]) => readonly [B, E]
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Semigroupoid: Semigroupoid2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Comonad: Comonad2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Foldable: Foldable2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Traversable: Traversable2<URI>
/**
 * Use [`mapFst`](#mapfst) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: readonly [A, E]) => readonly [B, E]
/**
 * Use [`mapSnd`](#mapsnd) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: readonly [A, E]) => readonly [A, G]
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.5.0
 * @deprecated
 */
export declare const readonlyTuple: Semigroupoid2<URI> &
  Bifunctor2<URI> &
  Comonad2<URI> &
  Foldable2<URI> &
  Traversable2<URI>
