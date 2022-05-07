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
exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.FromTask = exports.chainFirstReaderKW = exports.chainFirstReaderK = exports.chainReaderKW = exports.chainReaderK = exports.fromReaderK = exports.asks = exports.ask = exports.FromReader = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.chainFirstW = exports.chainFirst = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.flatten = exports.flattenW = exports.chainW = exports.chain = exports.of = exports.apW = exports.ap = exports.map = exports.asksReaderTask = exports.asksReaderTaskW = exports.local = exports.fromIO = exports.fromTask = exports.fromReader = void 0;
exports.run = exports.getMonoid = exports.getSemigroup = exports.readerTaskSeq = exports.readerTask = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = void 0;
/**
 * @since 2.3.0
 */
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var FromIO_1 = require("./FromIO");
var FromReader_1 = require("./FromReader");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var R = __importStar(require("./Reader"));
var RT = __importStar(require("./ReaderT"));
var T = __importStar(require("./Task"));
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.3.0
 */
exports.fromReader = 
/*#__PURE__*/
RT.fromReader(T.Pointed);
/**
 * @category natural transformations
 * @since 2.3.0
 */
exports.fromTask = 
/*#__PURE__*/
R.of;
/**
 * @category natural transformations
 * @since 2.3.0
 */
exports.fromIO = 
/*#__PURE__*/
function_1.flow(T.fromIO, exports.fromTask);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.3.0
 */
exports.local = R.local;
/**
 * Less strict version of [`asksReaderTask`](#asksreadertask).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.asksReaderTaskW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
exports.asksReaderTask = exports.asksReaderTaskW;
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
var _apPar = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var _apSeq = function (fab, fa) {
    return function_1.pipe(fab, exports.chain(function (f) { return function_1.pipe(fa, exports.map(f)); }));
};
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.3.0
 */
exports.map = 
/*#__PURE__*/
RT.map(T.Functor);
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.3.0
 */
exports.ap = 
/*#__PURE__*/
RT.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category Pointed
 * @since 2.3.0
 */
exports.of = 
/*#__PURE__*/
RT.of(T.Pointed);
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.3.0
 */
exports.chain = 
/*#__PURE__*/
RT.chain(T.Monad);
/**
 * Less strict version of  [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.7
 */
exports.chainW = exports.chain;
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
 * @since 2.3.0
 */
exports.flatten = exports.flattenW;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.3.0
 */
exports.URI = 'ReaderTask';
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
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.3.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply_1.apFirst(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.3.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply_1.apSecond(exports.ApplyPar);
/**
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.3.0
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
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category combinators
 * @since 2.4.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO_1.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainIOK = 
/*#__PURE__*/
FromIO_1.chainIOK(exports.FromIO, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstIOK = 
/*#__PURE__*/
FromIO_1.chainFirstIOK(exports.FromIO, exports.Chain);
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromReader = {
    URI: exports.URI,
    fromReader: exports.fromReader
};
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.3.0
 */
exports.ask = 
/*#__PURE__*/
FromReader_1.ask(exports.FromReader);
/**
 * Projects a value from the global context in a `ReaderTask`.
 *
 * @category constructors
 * @since 2.3.0
 */
exports.asks = 
/*#__PURE__*/
FromReader_1.asks(exports.FromReader);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.fromReaderK = 
/*#__PURE__*/
FromReader_1.fromReaderK(exports.FromReader);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainReaderK = 
/*#__PURE__*/
FromReader_1.chainReaderK(exports.FromReader, exports.Chain);
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.chainReaderKW = exports.chainReaderK;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstReaderK = 
/*#__PURE__*/
FromReader_1.chainFirstReaderK(exports.FromReader, exports.Chain);
/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstReaderKW = exports.chainFirstReaderK;
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category combinators
 * @since 2.4.0
 */
exports.fromTaskK = 
/*#__PURE__*/
FromTask_1.fromTaskK(exports.FromTask);
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainTaskK = 
/*#__PURE__*/
FromTask_1.chainTaskK(exports.FromTask, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstTaskK = 
/*#__PURE__*/
FromTask_1.chainFirstTaskK(exports.FromTask, exports.Chain);
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
/**
 * @since 2.8.0
 */
exports.bindW = exports.bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply_1.apS(exports.ApplyPar);
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
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function_1.flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(T.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
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
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
    return function_1.flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(T.traverseReadonlyNonEmptyArrayWithIndexSeq(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
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
/**
 * @since 2.10.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.10.0
 */
var traverseSeqArray = function (f) { return exports.traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * Use `traverseReadonlyArrayWithIndexSeq` instead.
 *
 * @since 2.10.0
 * @deprecated
 */
exports.sequenceSeqArray = 
/*#__PURE__*/
exports.traverseSeqArray(function_1.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
exports.readerTask = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
exports.readerTaskSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
exports.getSemigroup = 
/*#__PURE__*/
Apply_1.getApplySemigroup(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
exports.getMonoid = 
/*#__PURE__*/
Applicative_1.getApplicativeMonoid(exports.ApplicativeSeq);
/**
 * @since 2.4.0
 * @deprecated
 */
/* istanbul ignore next */
function run(ma, r) {
    return ma(r)();
}
exports.run = run;
