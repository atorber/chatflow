/**
 * ```ts
 * interface IO<A> {
 *   (): A
 * }
 * ```
 *
 * `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**. If you want to represent a synchronous computation that may fail, please see
 * `IOEither`.
 *
 * @since 2.0.0
 */
import { getApplicativeMonoid } from './Applicative';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup } from './Apply';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import { constant, identity } from './function';
import { bindTo as bindTo_, flap as flap_ } from './Functor';
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (ma, f) { return function () { return f(ma()); }; };
var _ap = function (mab, ma) { return function () { return mab()(ma()); }; };
var _chain = function (ma, f) { return function () { return f(ma())(); }; };
var _chainRec = function (a, f) { return function () {
    var e = f(a)();
    while (e._tag === 'Left') {
        e = f(e.left)();
    }
    return e.right;
}; };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return _map(fa, f); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export var ap = function (fa) { return function (fab) { return _ap(fab, fa); }; };
/**
 * @category Pointed
 * @since 2.0.0
 */
export var of = constant;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export var chain = function (f) { return function (ma) { return _chain(ma, f); }; };
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var flatten = 
/*#__PURE__*/
chain(identity);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'IO';
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export var flap = 
/*#__PURE__*/
flap_(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
export var Pointed = {
    URI: URI,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var apFirst = 
/*#__PURE__*/
apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var apSecond = 
/*#__PURE__*/
apSecond_(Apply);
/**
 * @category instances
 * @since 2.7.0
 */
export var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var chainFirst = 
/*#__PURE__*/
chainFirst_(Chain);
/**
 * @category constructors
 * @since 2.7.0
 * @deprecated
 */
export var fromIO = identity;
/**
 * @category instances
 * @since 2.7.0
 */
export var MonadIO = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.7.0
 */
export var ChainRec = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: _chain,
    chainRec: _chainRec
};
/**
 * @category instances
 * @since 2.10.0
 */
export var FromIO = {
    URI: URI,
    fromIO: identity
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
export var Do = 
/*#__PURE__*/
of(_.emptyRecord);
/**
 * @since 2.8.0
 */
export var bindTo = 
/*#__PURE__*/
bindTo_(Functor);
/**
 * @since 2.8.0
 */
export var bind = 
/*#__PURE__*/
bind_(Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
export var apS = 
/*#__PURE__*/
apS_(Apply);
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export var ApT = 
/*#__PURE__*/
of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function () {
    var out = [f(0, _.head(as))()];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i])());
    }
    return out;
}; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : ApT); };
};
/**
 * @since 2.9.0
 */
export var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
export var traverseArray = function (f) {
    return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); });
};
/**
 * @since 2.9.0
 */
export var sequenceArray = 
/*#__PURE__*/
traverseArray(identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var io = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: _chain,
    fromIO: fromIO,
    chainRec: _chainRec
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var getSemigroup = 
/*#__PURE__*/
getApplySemigroup(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var getMonoid = 
/*#__PURE__*/
getApplicativeMonoid(Applicative);
