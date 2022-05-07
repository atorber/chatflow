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
exports.chainFirstReaderEitherKW = exports.chainReaderEitherK = exports.chainReaderEitherKW = exports.fromReaderEitherK = exports.chainFirstTaskEitherK = exports.chainFirstTaskEitherKW = exports.chainTaskEitherK = exports.chainTaskEitherKW = exports.fromTaskEitherK = exports.chainIOEitherK = exports.chainIOEitherKW = exports.fromIOEitherK = exports.swap = exports.orLeft = exports.orElseFirstW = exports.orElseFirst = exports.orElseW = exports.orElse = exports.asksReaderTaskEither = exports.asksReaderTaskEitherW = exports.local = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.toUnion = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromReaderEither = exports.fromIOEither = exports.fromTask = exports.fromIO = exports.fromReader = exports.fromEither = exports.leftIO = exports.rightIO = exports.leftReaderTask = exports.rightReaderTask = exports.leftReader = exports.rightReader = exports.leftTask = exports.rightTask = exports.right = exports.left = exports.fromTaskEither = void 0;
exports.chainReaderTaskK = exports.chainReaderTaskKW = exports.fromReaderTaskK = exports.chainFirstReaderKW = exports.chainFirstReaderK = exports.chainReaderKW = exports.chainReaderK = exports.fromReaderK = exports.asks = exports.ask = exports.FromReader = exports.Alt = exports.Bifunctor = exports.chainFirstW = exports.chainFirst = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.Functor = exports.getAltReaderTaskValidation = exports.getApplicativeReaderTaskValidation = exports.getFilterable = exports.getCompactable = exports.URI = exports.throwError = exports.altW = exports.alt = exports.flatten = exports.flattenW = exports.chainW = exports.chain = exports.of = exports.apW = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.chainFirstReaderEitherK = void 0;
exports.run = exports.getReaderTaskValidation = exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.readerTaskEitherSeq = exports.readerTaskEither = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.bracketW = exports.bracket = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.FromTask = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.FromEither = exports.chainFirstReaderTaskK = exports.chainFirstReaderTaskKW = void 0;
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var Compactable_1 = require("./Compactable");
var E = __importStar(require("./Either"));
var ET = __importStar(require("./EitherT"));
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromReader_1 = require("./FromReader");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var R = __importStar(require("./Reader"));
var RT = __importStar(require("./ReaderTask"));
var T = __importStar(require("./Task"));
var TE = __importStar(require("./TaskEither"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromTaskEither = 
/*#__PURE__*/
R.of;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = 
/*#__PURE__*/
ET.left(RT.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = 
/*#__PURE__*/
ET.right(RT.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightTask = 
/*#__PURE__*/
function_1.flow(TE.rightTask, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftTask = 
/*#__PURE__*/
function_1.flow(TE.leftTask, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
var rightReader = function (ma) {
    return function_1.flow(ma, TE.right);
};
exports.rightReader = rightReader;
/**
 * @category constructors
 * @since 2.0.0
 */
var leftReader = function (me) {
    return function_1.flow(me, TE.left);
};
exports.leftReader = leftReader;
/**
 * @category constructors
 * @since 2.5.0
 */
exports.rightReaderTask = 
/*#__PURE__*/
ET.rightF(RT.Functor);
/**
 * @category constructors
 * @since 2.5.0
 */
exports.leftReaderTask = 
/*#__PURE__*/
ET.leftF(RT.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = 
/*#__PURE__*/
function_1.flow(TE.rightIO, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = 
/*#__PURE__*/
function_1.flow(TE.leftIO, exports.fromTaskEither);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromEither = RT.of;
/**
 * @category natural transformations
 * @since 2.11.0
 */
exports.fromReader = exports.rightReader;
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromIO = exports.rightIO;
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromTask = exports.rightTask;
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromIOEither = 
/*#__PURE__*/
function_1.flow(TE.fromIOEither, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
var fromReaderEither = function (ma) { return function_1.flow(ma, TE.fromEither); };
exports.fromReaderEither = fromReaderEither;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/
ET.match(RT.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * @category destructors
 * @since 2.10.0
 */
exports.matchE = 
/*#__PURE__*/
ET.matchE(RT.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchEW = exports.matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = 
/*#__PURE__*/
ET.getOrElse(RT.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
exports.getOrElseW = exports.getOrElse;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * @category interop
 * @since 2.10.0
 */
exports.toUnion = 
/*#__PURE__*/
ET.toUnion(RT.Functor);
/**
 * @category interop
 * @since 2.12.0
 */
exports.fromNullable = 
/*#__PURE__*/
ET.fromNullable(RT.Pointed);
/**
 * @category interop
 * @since 2.12.0
 */
exports.fromNullableK = 
/*#__PURE__*/
ET.fromNullableK(RT.Pointed);
/**
 * @category interop
 * @since 2.12.0
 */
exports.chainNullableK = 
/*#__PURE__*/
ET.chainNullableK(RT.Monad);
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
exports.local = R.local;
/**
 * Less strict version of [`asksReaderTaskEither`](#asksreadertaskeither).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.asksReaderTaskEitherW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
exports.asksReaderTaskEither = exports.asksReaderTaskEitherW;
/**
 * @category combinators
 * @since 2.0.0
 */
exports.orElse = 
/*#__PURE__*/
ET.orElse(RT.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
exports.orElseW = exports.orElse;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orElseFirst = 
/*#__PURE__*/
ET.orElseFirst(RT.Monad);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orElseFirstW = exports.orElseFirst;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orLeft = 
/*#__PURE__*/
ET.orLeft(RT.Monad);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.swap = 
/*#__PURE__*/
ET.swap(RT.Functor);
/**
 * @category combinators
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return function_1.flow(f, exports.fromIOEither); };
exports.fromIOEitherK = fromIOEitherK;
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainIOEitherKW = function (f) { return exports.chainW(exports.fromIOEitherK(f)); };
exports.chainIOEitherKW = chainIOEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainIOEitherK = exports.chainIOEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
var fromTaskEitherK = function (f) { return function_1.flow(f, exports.fromTaskEither); };
exports.fromTaskEitherK = fromTaskEitherK;
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainTaskEitherKW = function (f) { return exports.chainW(exports.fromTaskEitherK(f)); };
exports.chainTaskEitherKW = chainTaskEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainTaskEitherK = exports.chainTaskEitherKW;
/**
 * Less strict version of [`chainFirstTaskEitherK`](#chainfirsttaskeitherk).
 *
 * @category combinators
 * @since 2.11.0
 */
var chainFirstTaskEitherKW = function (f) { return exports.chainFirstW(exports.fromTaskEitherK(f)); };
exports.chainFirstTaskEitherKW = chainFirstTaskEitherKW;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstTaskEitherK = exports.chainFirstTaskEitherKW;
/**
 * @category combinators
 * @since 2.11.0
 */
var fromReaderEitherK = function (f) { return function_1.flow(f, exports.fromReaderEither); };
exports.fromReaderEitherK = fromReaderEitherK;
/**
 * Less strict version of [`chainReaderEitherK`](#chainreadereitherk).
 *
 * @category combinators
 * @since 2.11.0
 */
var chainReaderEitherKW = function (f) {
    return exports.chainW(exports.fromReaderEitherK(f));
};
exports.chainReaderEitherKW = chainReaderEitherKW;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainReaderEitherK = exports.chainReaderEitherKW;
/**
 * Less strict version of [`chainFirstReaderEitherK`](#chainfirstreadereitherk).
 *
 * @category combinators
 * @since 2.11.0
 */
var chainFirstReaderEitherKW = function (f) {
    return exports.chainFirstW(exports.fromReaderEitherK(f));
};
exports.chainFirstReaderEitherKW = chainFirstReaderEitherKW;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstReaderEitherK = exports.chainFirstReaderEitherKW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
var _apPar = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var _apSeq = function (fab, fa) {
    return function_1.pipe(fab, exports.chain(function (f) { return function_1.pipe(fa, exports.map(f)); }));
};
/* istanbul ignore next */
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return function_1.pipe(fa, exports.bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return function_1.pipe(fa, exports.mapLeft(f)); };
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
exports.map = 
/*#__PURE__*/
ET.map(RT.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.bimap = 
/*#__PURE__*/
ET.bimap(RT.Functor);
/**
 * Map a function over the second type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.mapLeft = 
/*#__PURE__*/
ET.mapLeft(RT.Functor);
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = 
/*#__PURE__*/
ET.ap(RT.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category Pointed
 * @since 2.7.0
 */
exports.of = exports.right;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
exports.chain = 
/*#__PURE__*/
ET.chain(RT.Monad);
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
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
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
exports.alt = 
/*#__PURE__*/
ET.alt(RT.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
exports.altW = exports.alt;
/**
 * @category MonadThrow
 * @since 2.0.0
 */
exports.throwError = exports.left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'ReaderTaskEither';
/**
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: Compactable_1.compact(RT.Functor, C),
        separate: Compactable_1.separate(RT.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category instances
 * @since 2.10.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = exports.getCompactable(M);
    var filter = Filterable_1.filter(RT.Functor, F);
    var filterMap = Filterable_1.filterMap(RT.Functor, F);
    var partition = Filterable_1.partition(RT.Functor, F);
    var partitionMap = Filterable_1.partitionMap(RT.Functor, F);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: C.compact,
        separate: C.separate,
        filter: function (fa, predicate) { return function_1.pipe(fa, filter(predicate)); },
        filterMap: function (fa, f) { return function_1.pipe(fa, filterMap(f)); },
        partition: function (fa, predicate) { return function_1.pipe(fa, partition(predicate)); },
        partitionMap: function (fa, f) { return function_1.pipe(fa, partitionMap(f)); }
    };
}
exports.getFilterable = getFilterable;
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeReaderTaskValidation(A, S) {
    var ap = Apply_1.ap(R.Apply, TE.getApplicativeTaskValidation(A, S));
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return function_1.pipe(fab, ap(fa)); },
        of: exports.of
    };
}
exports.getApplicativeReaderTaskValidation = getApplicativeReaderTaskValidation;
/**
 * @category instances
 * @since 2.7.0
 */
function getAltReaderTaskValidation(S) {
    var alt = ET.altValidation(RT.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return function_1.pipe(fa, alt(that)); }
    };
}
exports.getAltReaderTaskValidation = getAltReaderTaskValidation;
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
 * @since 2.0.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply_1.apFirst(exports.ApplyPar);
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
Apply_1.apSecond(exports.ApplyPar);
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
    ap: _apPar,
    chain: _chain,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of,
    throwError: exports.throwError
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
 * @since 2.8.0
 */
exports.chainFirstW = exports.chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
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
 * @since 2.0.0
 */
exports.ask = 
/*#__PURE__*/
FromReader_1.ask(exports.FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
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
 * @category combinators
 * @since 2.11.0
 */
var fromReaderTaskK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.rightReaderTask(f.apply(void 0, a));
}; };
exports.fromReaderTaskK = fromReaderTaskK;
/**
 * Less strict version of [`chainReaderTaskK`](#chainreadertaskk).
 *
 * @category combinators
 * @since 2.11.0
 */
var chainReaderTaskKW = function (f) {
    return exports.chainW(exports.fromReaderTaskK(f));
};
exports.chainReaderTaskKW = chainReaderTaskKW;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainReaderTaskK = exports.chainReaderTaskKW;
/**
 * Less strict version of [`chainFirstReaderTaskK`](#chainfirstreadertaskk).
 *
 * @category combinators
 * @since 2.11.0
 */
var chainFirstReaderTaskKW = function (f) {
    return exports.chainFirstW(exports.fromReaderTaskK(f));
};
exports.chainFirstReaderTaskKW = chainFirstReaderTaskKW;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstReaderTaskK = exports.chainFirstReaderTaskKW;
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/
FromEither_1.fromOption(exports.FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/
FromEither_1.fromOptionK(exports.FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainOptionK = 
/*#__PURE__*/
FromEither_1.chainOptionK(exports.FromEither, exports.Chain);
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainEitherK = 
/*#__PURE__*/
FromEither_1.chainEitherK(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
exports.chainEitherKW = exports.chainEitherK;
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainFirstEitherK = 
/*#__PURE__*/
FromEither_1.chainFirstEitherK(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * @category combinators
 * @since 2.12.0
 */
exports.chainFirstEitherKW = exports.chainFirstEitherK;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromPredicate = 
/*#__PURE__*/
FromEither_1.fromPredicate(exports.FromEither);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.filterOrElse = 
/*#__PURE__*/
FromEither_1.filterOrElse(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.fromEitherK = 
/*#__PURE__*/
FromEither_1.fromEitherK(exports.FromEither);
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
 * @since 2.10.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO_1.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.10.0
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
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromTaskK = 
/*#__PURE__*/
FromTask_1.fromTaskK(exports.FromTask);
/**
 * @category combinators
 * @since 2.10.0
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
// utils
// -------------------------------------------------------------------------------------
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.4
 */
function bracket(acquire, use, release) {
    return bracketW(acquire, use, release);
}
exports.bracket = bracket;
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
function bracketW(acquire, use, release) {
    return function (r) {
        return TE.bracketW(acquire(r), function (a) { return use(a)(r); }, function (a, e) { return release(a, e)(r); });
    };
}
exports.bracketW = bracketW;
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
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function_1.flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(TE.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
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
    return function_1.flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(TE.traverseReadonlyNonEmptyArrayWithIndexSeq(function_1.SK)));
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
/**
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
var traverseSeqArray = function (f) {
    return exports.traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); });
};
exports.traverseSeqArray = traverseSeqArray;
/**
 * @since 2.9.0
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
 * @since 2.0.0
 * @deprecated
 */
exports.readerTaskEither = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    alt: _alt,
    bimap: _bimap,
    mapLeft: _mapLeft,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.readerTaskEitherSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: _chain,
    alt: _alt,
    bimap: _bimap,
    mapLeft: _mapLeft,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/
Apply_1.getApplySemigroup(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/
Applicative_1.getApplicativeMonoid(exports.ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup = function (S) {
    return Apply_1.getApplySemigroup(RT.ApplySeq)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeReaderTaskValidation`](#getapplicativereadertaskvalidation) and [`getAltReaderTaskValidation`](#getaltreadertaskvalidation) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
function getReaderTaskValidation(SE) {
    var applicativeReaderTaskValidation = getApplicativeReaderTaskValidation(T.ApplicativePar, SE);
    var altReaderTaskValidation = getAltReaderTaskValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        of: exports.of,
        chain: _chain,
        bimap: _bimap,
        mapLeft: _mapLeft,
        ap: applicativeReaderTaskValidation.ap,
        alt: altReaderTaskValidation.alt,
        fromIO: exports.fromIO,
        fromTask: exports.fromTask,
        throwError: exports.throwError
    };
}
exports.getReaderTaskValidation = getReaderTaskValidation;
/**
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
function run(ma, r) {
    return ma(r)();
}
exports.run = run;
