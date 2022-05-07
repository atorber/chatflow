import { pipe } from './function';
import { flap as flap_ } from './Functor';
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Appends a value to the accumulator
 *
 * @category combinators
 * @since 2.0.0
 */
export var tell = function (w) { return function () { return [undefined, w]; }; };
/**
 * Modifies the result to include the changes to the accumulator
 *
 * @category combinators
 * @since 2.0.0
 */
export var listen = function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [[a, w], w];
}; };
/**
 * Applies the returned function to the accumulator
 *
 * @category combinators
 * @since 2.0.0
 */
export var pass = function (fa) { return function () {
    var _a = fa(), _b = _a[0], a = _b[0], f = _b[1], w = _a[1];
    return [a, f(w)];
}; };
/**
 * Projects a value from modifications made to the accumulator during an action
 *
 * @category combinators
 * @since 2.0.0
 */
export var listens = function (f) { return function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [[a, f(w)], w];
}; }; };
/**
 * Modify the final accumulator value by applying a function
 *
 * @category combinators
 * @since 2.0.0
 */
export var censor = function (f) { return function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [a, f(w)];
}; }; };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
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
export var map = function (f) { return function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [f(a), w];
}; }; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'Writer';
/**
 * @category instances
 * @since 2.10.0
 */
export var getPointed = function (M) { return ({
    URI: URI,
    _E: undefined,
    of: function (a) { return function () { return [a, M.empty]; }; }
}); };
/**
 * @category instances
 * @since 2.10.0
 */
export var getApply = function (S) { return ({
    URI: URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) { return function () {
        var _a = fab(), f = _a[0], w1 = _a[1];
        var _b = fa(), a = _b[0], w2 = _b[1];
        return [f(a), S.concat(w1, w2)];
    }; }
}); };
/**
 * @category instances
 * @since 2.10.0
 */
export var getApplicative = function (M) {
    var A = getApply(M);
    var P = getPointed(M);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: P.of
    };
};
/**
 * @category instances
 * @since 2.10.0
 */
export function getChain(M) {
    var A = getApply(M);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: function (fa, f) { return function () {
            var _a = fa(), a = _a[0], w1 = _a[1];
            var _b = f(a)(), b = _b[0], w2 = _b[1];
            return [b, M.concat(w1, w2)];
        }; }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getMonad(M) {
    var A = getApplicative(M);
    var C = getChain(M);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: A.of,
        chain: C.chain
    };
}
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
export var evaluate = function (fa) { return fa()[0]; };
/**
 * @since 2.8.0
 */
export var execute = function (fa) { return fa()[1]; };
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export var evalWriter = function (fa) { return fa()[0]; };
/**
 * Use [`execute`](#execute) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export var execWriter = function (fa) { return fa()[1]; };
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var writer = Functor;
