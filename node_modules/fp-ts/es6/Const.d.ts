/**
 * The `Const` type constructor, which wraps its first type argument and ignores its second.
 * That is, `Const<E, A>` is isomorphic to `E` for any `A`.
 *
 * `Const` has some useful instances. For example, the `Applicative` instance allows us to collect results using a `Monoid`
 * while ignoring return values.
 *
 * @since 2.0.0
 */
import { Applicative2C } from './Applicative'
import { Apply2C } from './Apply'
import { Bifunctor2 } from './Bifunctor'
import { BooleanAlgebra } from './BooleanAlgebra'
import { Bounded } from './Bounded'
import { Contravariant2 } from './Contravariant'
import { Eq } from './Eq'
import { Functor2 } from './Functor'
import { HeytingAlgebra } from './HeytingAlgebra'
import { Monoid } from './Monoid'
import { Ord } from './Ord'
import { Ring } from './Ring'
import { Semigroup } from './Semigroup'
import { Semiring } from './Semiring'
import { Show } from './Show'
/**
 * @category model
 * @since 2.0.0
 */
export declare type Const<E, A> = E & {
  readonly _A: A
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const make: <E, A = never>(e: E) => Const<E, A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getShow<E, A>(S: Show<E>): Show<Const<E, A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getEq: <E, A>(E: Eq<E>) => Eq<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getOrd: <E, A>(O: Ord<E>) => Ord<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getBounded: <E, A>(B: Bounded<E>) => Bounded<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getSemigroup: <E, A>(S: Semigroup<E>) => Semigroup<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getMonoid: <E, A>(M: Monoid<E>) => Monoid<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getSemiring: <E, A>(S: Semiring<E>) => Semiring<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getRing: <E, A>(S: Ring<E>) => Ring<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getHeytingAlgebra: <E, A>(H: HeytingAlgebra<E>) => HeytingAlgebra<Const<E, A>>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const getBooleanAlgebra: <E, A>(H: BooleanAlgebra<E>) => BooleanAlgebra<Const<E, A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getApply<E>(S: Semigroup<E>): Apply2C<URI, E>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getApplicative<E>(M: Monoid<E>): Applicative2C<URI, E>
/**
 * @category Contravariant
 * @since 2.0.0
 */
export declare const contramap: <A, B>(f: (b: B) => A) => <E>(fa: Const<E, A>) => Const<E, B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Const<E, A>) => Const<E, B>
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
export declare const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: Const<E, A>) => Const<G, B>
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: Const<E, A>) => Const<G, A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const URI = 'Const'
/**
 * @category instances
 * @since 2.0.0
 */
export declare type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Const<E, A>
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
export declare const flap: <A>(a: A) => <E, B>(fab: Const<E, (a: A) => B>) => Const<E, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Contravariant: Contravariant2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor2<URI>
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export declare const const_: Functor2<URI> & Contravariant2<URI> & Bifunctor2<URI>
