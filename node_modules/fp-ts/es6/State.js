import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import { identity, pipe } from './function';
import { bindTo as bindTo_, flap as flap_ } from './Functor';
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export var get = function () { return function (s) { return [s, s]; }; };
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export var put = function (s) { return function () { return [undefined, s]; }; };
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export var modify = function (f) { return function (s) { return [undefined, f(s)]; }; };
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export var gets = function (f) { return function (s) { return [f(s), s]; }; };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return pipe(ma, chain(f)); };
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
export var map = function (f) { return function (fa) { return function (s1) {
    var _a = fa(s1), a = _a[0], s2 = _a[1];
    return [f(a), s2];
}; }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export var ap = function (fa) { return function (fab) { return function (s1) {
    var _a = fab(s1), f = _a[0], s2 = _a[1];
    var _b = fa(s2), a = _b[0], s3 = _b[1];
    return [f(a), s3];
}; }; };
/**
 * @category Pointed
 * @since 2.0.0
 */
export var of = function (a) { return function (s) { return [a, s]; }; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export var chain = function (f) { return function (ma) { return function (s1) {
    var _a = ma(s1), a = _a[0], s2 = _a[1];
    return f(a)(s2);
}; }; };
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
export var URI = 'State';
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
 * @category instances
 * @since 2.11.0
 */
export var FromState = {
    URI: URI,
    fromState: identity
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Run a computation in the `State` monad, discarding the final state
 *
 * @since 2.8.0
 */
export var evaluate = function (s) { return function (ma) { return ma(s)[0]; }; };
/**
 * Run a computation in the `State` monad discarding the result
 *
 * @since 2.8.0
 */
export var execute = function (s) { return function (ma) { return ma(s)[1]; }; };
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
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
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function (s) {
    var _a = f(0, _.head(as))(s), b = _a[0], s2 = _a[1];
    var bs = [b];
    var out = s2;
    for (var i = 1; i < as.length; i++) {
        var _b = f(i, as[i])(out), b_1 = _b[0], s2_1 = _b[1];
        bs.push(b_1);
        out = s2_1;
    }
    return [bs, out];
}; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : of(_.emptyReadonlyArray)); };
};
/**
 * @since 2.9.0
 */
export var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
export var traverseArray = function (f) { return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
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
 * Use [`evaluate`](#evaluate) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export var evalState = function (ma, s) { return ma(s)[0]; };
/**
 * Use [`execute`](#execute) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export var execState = function (ma, s) { return ma(s)[1]; };
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var state = Monad;
