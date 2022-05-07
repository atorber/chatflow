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
exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.Do = exports.bindW = exports.bind = exports.bindTo = exports.Choice = exports.Strong = exports.Category = exports.Profunctor = exports.chainFirstW = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.right = exports.left = exports.second = exports.first = exports.id = exports.promap = exports.compose = exports.flatten = exports.flattenW = exports.chain = exports.chainW = exports.of = exports.ap = exports.apW = exports.map = exports.asksReader = exports.asksReaderW = exports.local = exports.asks = exports.ask = void 0;
exports.getMonoid = exports.getSemigroup = exports.reader = void 0;
/**
 * @since 2.0.0
 */
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var E = __importStar(require("./Either"));
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Reads the current context
 *
 * @category constructors
 * @since 2.0.0
 */
var ask = function () { return function_1.identity; };
exports.ask = ask;
/**
 * Projects a value from the global context in a Reader
 *
 * @category constructors
 * @since 2.0.0
 */
exports.asks = function_1.identity;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.0.0
 */
var local = function (f) { return function (ma) { return function (r2) {
    return ma(f(r2));
}; }; };
exports.local = local;
/**
 * Less strict version of [`asksReader`](#asksreader).
 *
 * @category combinators
 * @since 2.11.0
 */
var asksReaderW = function (f) { return function (r) { return f(r)(r); }; };
exports.asksReaderW = asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
exports.asksReader = exports.asksReaderW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
var _compose = function (bc, ab) { return function_1.pipe(bc, exports.compose(ab)); };
var _promap = function (fea, f, g) { return function_1.pipe(fea, exports.promap(f, g)); };
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
var map = function (f) { return function (fa) { return function (r) { return f(fa(r)); }; }; };
exports.map = map;
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
var apW = function (fa) { return function (fab) { return function (r) { return fab(r)(fa(r)); }; }; };
exports.apW = apW;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = exports.apW;
/**
 * @category Pointed
 * @since 2.0.0
 */
exports.of = function_1.constant;
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
var chainW = function (f) { return function (fa) { return function (r) { return f(fa(r))(r); }; }; };
exports.chainW = chainW;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
exports.chain = exports.chainW;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.flattenW = 
/*#__PURE__*/
exports.chainW(function_1.identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * @category Semigroupoid
 * @since 2.0.0
 */
var compose = function (ab) { return function (bc) { return function_1.flow(ab, bc); }; };
exports.compose = compose;
/**
 * @category Profunctor
 * @since 2.0.0
 */
var promap = function (f, g) { return function (fea) { return function (a) { return g(fea(f(a))); }; }; };
exports.promap = promap;
/**
 * @category Category
 * @since 2.0.0
 */
var id = function () { return function_1.identity; };
exports.id = id;
/**
 * @category Strong
 * @since 2.10.0
 */
var first = function (pab) { return function (_a) {
    var a = _a[0], c = _a[1];
    return [pab(a), c];
}; };
exports.first = first;
/**
 * @category Strong
 * @since 2.10.0
 */
var second = function (pbc) { return function (_a) {
    var a = _a[0], b = _a[1];
    return [a, pbc(b)];
}; };
exports.second = second;
/**
 * @category Choice
 * @since 2.10.0
 */
var left = function (pab) { return E.fold(function (a) { return _.left(pab(a)); }, E.right); };
exports.left = left;
/**
 * @category Choice
 * @since 2.10.0
 */
var right = function (pbc) { return E.fold(E.left, function (b) { return _.right(pbc(b)); }); };
exports.right = right;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Reader';
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
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @category combinators
 * @since 2.12.0
 */
exports.apFirstW = exports.apFirst;
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
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @category combinators
 * @since 2.12.0
 */
exports.apSecondW = exports.apSecond;
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
    of: exports.of,
    ap: _ap,
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
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstW = exports.chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Profunctor = {
    URI: exports.URI,
    map: _map,
    promap: _promap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Category = {
    URI: exports.URI,
    compose: _compose,
    id: exports.id
};
/**
 * @category instances
 * @since 2.8.3
 */
exports.Strong = {
    URI: exports.URI,
    map: _map,
    promap: _promap,
    first: exports.first,
    second: exports.second
};
/**
 * @category instances
 * @since 2.8.3
 */
exports.Choice = {
    URI: exports.URI,
    map: _map,
    promap: _promap,
    left: exports.left,
    right: exports.right
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
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
/**
 * @since 2.8.0
 */
exports.bindW = exports.bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
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
exports.apS = 
/*#__PURE__*/
Apply_1.apS(exports.Apply);
/**
 * @since 2.8.0
 */
exports.apSW = exports.apS;
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
var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function (r) {
    var out = [f(0, _.head(as))(r)];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i])(r));
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
var traverseArray = function (f) { return exports.traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
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
exports.reader = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    promap: _promap,
    compose: _compose,
    id: exports.id,
    first: exports.first,
    second: exports.second,
    left: exports.left,
    right: exports.right
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
