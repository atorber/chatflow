import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import { tailRec } from './ChainRec';
import { identity as id, pipe } from './function';
import { bindTo as bindTo_, flap as flap_ } from './Functor';
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return pipe(fa, map(f)); };
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
var _chain = function (ma, f) { return pipe(ma, chain(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return pipe(fa, reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) { return function (fa, f) { return pipe(fa, foldMap(M)(f)); }; };
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return pipe(fa, reduceRight(b, f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return pipe(fa, alt(that)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return pipe(wa, extend(f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = traverse(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
var _chainRec = tailRec;
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
export var map = function (f) { return function (fa) { return f(fa); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export var ap = function (fa) { return function (fab) { return fab(fa); }; };
/**
 * @category Pointed
 * @since 2.0.0
 */
export var of = id;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export var chain = function (f) { return function (ma) { return f(ma); }; };
/**
 * @category Extend
 * @since 2.0.0
 */
export var extend = function (f) { return function (wa) { return f(wa); }; };
/**
 * @category Extract
 * @since 2.6.2
 */
export var extract = id;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var duplicate = 
/*#__PURE__*/
extend(id);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var flatten = 
/*#__PURE__*/
chain(id);
/**
 * @category Foldable
 * @since 2.0.0
 */
export var reduce = function (b, f) { return function (fa) { return f(b, fa); }; };
/**
 * @category Foldable
 * @since 2.0.0
 */
export var foldMap = function () { return function (f) { return function (fa) { return f(fa); }; }; };
/**
 * @category Foldable
 * @since 2.0.0
 */
export var reduceRight = function (b, f) { return function (fa) { return f(fa, b); }; };
/**
 * @since 2.6.3
 */
export var traverse = function (F) { return function (f) { return function (ta) { return F.map(f(ta), id); }; }; };
/**
 * @since 2.6.3
 */
export var sequence = function (F) { return function (ta) {
    return F.map(ta, id);
}; };
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export var altW = function () { return id; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
export var alt = altW;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'Identity';
/**
 * @category instances
 * @since 2.0.0
 */
export var getShow = id;
/**
 * @category instances
 * @since 2.0.0
 */
export var getEq = id;
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
 * @since 2.7.0
 */
export var Foldable = {
    URI: URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Traversable = {
    URI: URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Comonad = {
    URI: URI,
    map: _map,
    extend: _extend,
    extract: extract
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
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var identity = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    alt: _alt,
    extract: extract,
    extend: _extend,
    chainRec: _chainRec
};
