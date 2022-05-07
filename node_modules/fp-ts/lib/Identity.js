"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.ChainRec = exports.Comonad = exports.Alt = exports.Traversable = exports.Foldable = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.getEq = exports.getShow = exports.URI = exports.alt = exports.altW = exports.sequence = exports.traverse = exports.reduceRight = exports.foldMap = exports.reduce = exports.flatten = exports.duplicate = exports.extract = exports.extend = exports.chain = exports.of = exports.ap = exports.map = void 0;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var ChainRec_1 = require("./ChainRec");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return function_1.pipe(fa, exports.reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) { return function (fa, f) { return function_1.pipe(fa, exports.foldMap(M)(f)); }; };
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return function_1.pipe(fa, exports.reduceRight(b, f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return function_1.pipe(wa, exports.extend(f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = exports.traverse(F);
    return function (ta, f) { return function_1.pipe(ta, traverseF(f)); };
};
var _chainRec = ChainRec_1.tailRec;
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
var map = function (f) { return function (fa) { return f(fa); }; };
exports.map = map;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) { return fab(fa); }; };
exports.ap = ap;
/**
 * @category Pointed
 * @since 2.0.0
 */
exports.of = function_1.identity;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) { return f(ma); }; };
exports.chain = chain;
/**
 * @category Extend
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) { return f(wa); }; };
exports.extend = extend;
/**
 * @category Extract
 * @since 2.6.2
 */
exports.extract = function_1.identity;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.duplicate = 
/*#__PURE__*/
exports.extend(function_1.identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(function_1.identity);
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) { return f(b, fa); }; };
exports.reduce = reduce;
/**
 * @category Foldable
 * @since 2.0.0
 */
var foldMap = function () { return function (f) { return function (fa) { return f(fa); }; }; };
exports.foldMap = foldMap;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) { return f(fa, b); }; };
exports.reduceRight = reduceRight;
/**
 * @since 2.6.3
 */
var traverse = function (F) { return function (f) { return function (ta) { return F.map(f(ta), function_1.identity); }; }; };
exports.traverse = traverse;
/**
 * @since 2.6.3
 */
var sequence = function (F) { return function (ta) {
    return F.map(ta, function_1.identity);
}; };
exports.sequence = sequence;
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW = function () { return function_1.identity; };
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
exports.alt = exports.altW;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Identity';
/**
 * @category instances
 * @since 2.0.0
 */
exports.getShow = function_1.identity;
/**
 * @category instances
 * @since 2.0.0
 */
exports.getEq = function_1.identity;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#__PURE__*/
Functor_1.flap(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
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
exports.apFirst = 
/*#__PURE__*/
Apply_1.apFirst(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply_1.apSecond(exports.Apply);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
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
exports.chainFirst = 
/*#__PURE__*/
Chain_1.chainFirst(exports.Chain);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Comonad = {
    URI: exports.URI,
    map: _map,
    extend: _extend,
    extract: exports.extract
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ChainRec = {
    URI: exports.URI,
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
exports.Do = 
/*#__PURE__*/
exports.of(_.emptyRecord);
/**
 * @since 2.8.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor_1.bindTo(exports.Functor);
/**
 * @since 2.8.0
 */
exports.bind = 
/*#__PURE__*/
Chain_1.bind(exports.Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply_1.apS(exports.Apply);
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
exports.identity = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    alt: _alt,
    extract: exports.extract,
    extend: _extend,
    chainRec: _chainRec
};
