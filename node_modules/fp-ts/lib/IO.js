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
exports.getMonoid = exports.getSemigroup = exports.io = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.FromIO = exports.ChainRec = exports.MonadIO = exports.fromIO = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.flatten = exports.chain = exports.of = exports.ap = exports.map = void 0;
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
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
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
var map = function (f) { return function (fa) { return _map(fa, f); }; };
exports.map = map;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) { return _ap(fab, fa); }; };
exports.ap = ap;
/**
 * @category Pointed
 * @since 2.0.0
 */
exports.of = function_1.constant;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) { return _chain(ma, f); }; };
exports.chain = chain;
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(function_1.identity);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'IO';
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
 * @category constructors
 * @since 2.7.0
 * @deprecated
 */
exports.fromIO = function_1.identity;
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    fromIO: exports.fromIO
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
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: function_1.identity
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
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.ApT = 
/*#__PURE__*/
exports.of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function () {
    var out = [f(0, _.head(as))()];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i])());
    }
    return out;
}; }; };
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
var traverseArray = function (f) {
    return exports.traverseReadonlyArrayWithIndex(function (_, a) { return f(a); });
};
exports.traverseArray = traverseArray;
/**
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(function_1.identity);
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
exports.io = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    fromIO: exports.fromIO,
    chainRec: _chainRec
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getSemigroup = 
/*#__PURE__*/
Apply_1.getApplySemigroup(exports.Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getMonoid = 
/*#__PURE__*/
Applicative_1.getApplicativeMonoid(exports.Applicative);
