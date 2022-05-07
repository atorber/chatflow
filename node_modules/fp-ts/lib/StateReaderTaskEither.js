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
exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.throwError = exports.alt = exports.altW = exports.flatten = exports.flattenW = exports.chainW = exports.chain = exports.of = exports.apW = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.chainReaderTaskEitherK = exports.chainReaderTaskEitherKW = exports.fromReaderTaskEitherK = exports.chainTaskEitherK = exports.chainTaskEitherKW = exports.fromTaskEitherK = exports.chainIOEitherK = exports.chainIOEitherKW = exports.fromIOEitherK = exports.asksStateReaderTaskEither = exports.asksStateReaderTaskEitherW = exports.local = exports.fromReaderTaskEither = exports.fromReaderEither = exports.fromIOEither = exports.fromTaskEither = exports.fromState = exports.fromTask = exports.fromIO = exports.fromReader = exports.fromEither = exports.leftState = exports.rightState = exports.leftIO = exports.rightIO = exports.leftReader = exports.rightReader = exports.leftTask = exports.rightTask = exports.right = exports.left = void 0;
exports.execute = exports.evaluate = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.FromTask = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.FromEither = exports.chainFirstReaderKW = exports.chainFirstReaderK = exports.chainReaderKW = exports.chainReaderK = exports.fromReaderK = exports.asks = exports.ask = exports.FromReader = exports.Alt = exports.Bifunctor = exports.chainFirstW = exports.chainFirst = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.chainStateK = exports.fromStateK = exports.gets = exports.modify = exports.put = exports.get = exports.FromState = exports.Chain = exports.Applicative = exports.apSecondW = exports.apSecond = exports.apFirstW = void 0;
exports.run = exports.execState = exports.evalState = exports.stateReaderTaskEitherSeq = exports.stateReaderTaskEither = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = void 0;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var E = __importStar(require("./Either"));
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromReader_1 = require("./FromReader");
var FromState_1 = require("./FromState");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var R = __importStar(require("./Reader"));
var RTE = __importStar(require("./ReaderTaskEither"));
var ST = __importStar(require("./StateT"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var left = function (e) { return function () { return RTE.left(e); }; };
exports.left = left;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = 
/*#__PURE__*/
ST.of(RTE.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
function rightTask(ma) {
    return exports.fromReaderTaskEither(RTE.rightTask(ma));
}
exports.rightTask = rightTask;
/**
 * @category constructors
 * @since 2.0.0
 */
function leftTask(me) {
    return exports.fromReaderTaskEither(RTE.leftTask(me));
}
exports.leftTask = leftTask;
/**
 * @category constructors
 * @since 2.0.0
 */
function rightReader(ma) {
    return exports.fromReaderTaskEither(RTE.rightReader(ma));
}
exports.rightReader = rightReader;
/**
 * @category constructors
 * @since 2.0.0
 */
function leftReader(me) {
    return exports.fromReaderTaskEither(RTE.leftReader(me));
}
exports.leftReader = leftReader;
/**
 * @category constructors
 * @since 2.0.0
 */
function rightIO(ma) {
    return exports.fromReaderTaskEither(RTE.rightIO(ma));
}
exports.rightIO = rightIO;
/**
 * @category constructors
 * @since 2.0.0
 */
function leftIO(me) {
    return exports.fromReaderTaskEither(RTE.leftIO(me));
}
exports.leftIO = leftIO;
/**
 * @category constructors
 * @since 2.0.0
 */
var rightState = function (sa) {
    return function_1.flow(sa, RTE.right);
};
exports.rightState = rightState;
/**
 * @category constructors
 * @since 2.0.0
 */
var leftState = function (me) { return function (s) { return RTE.left(me(s)[0]); }; };
exports.leftState = leftState;
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromEither = 
/*#__PURE__*/
E.match(function (e) { return exports.left(e); }, exports.right);
/**
 * @category natural transformations
 * @since 2.11.0
 */
exports.fromReader = rightReader;
/**
 * @category natural transformations
 * @since 2.7.0
 */
exports.fromIO = rightIO;
/**
 * @category natural transformations
 * @since 2.7.0
 */
exports.fromTask = rightTask;
/**
 * @category natural transformations
 * @since 2.10.0
 */
exports.fromState = 
/*#__PURE__*/
ST.fromState(RTE.Pointed);
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromTaskEither = function (ma) { return exports.fromReaderTaskEither(RTE.fromTaskEither(ma)); };
exports.fromTaskEither = fromTaskEither;
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromIOEither = function (ma) { return exports.fromReaderTaskEither(RTE.fromIOEither(ma)); };
exports.fromIOEither = fromIOEither;
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromReaderEither = function (ma) {
    return exports.fromReaderTaskEither(RTE.fromReaderEither(ma));
};
exports.fromReaderEither = fromReaderEither;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromReaderTaskEither = 
/*#__PURE__*/
ST.fromF(RTE.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.11.0
 */
var local = function (f) { return function (ma) { return function_1.flow(ma, R.local(f)); }; };
exports.local = local;
/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category combinators
 * @since 2.11.0
 */
var asksStateReaderTaskEitherW = function (f) { return function (s) { return function (r) { return f(r)(s)(r); }; }; };
exports.asksStateReaderTaskEitherW = asksStateReaderTaskEitherW;
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
exports.asksStateReaderTaskEither = exports.asksStateReaderTaskEitherW;
/**
 * @category combinators
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.fromIOEither(f.apply(void 0, a));
}; };
exports.fromIOEitherK = fromIOEitherK;
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainIOEitherKW = function (f) { return function (ma) { return function_1.pipe(ma, exports.chainW(exports.fromIOEitherK(f))); }; };
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
var fromTaskEitherK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.fromTaskEither(f.apply(void 0, a));
}; };
exports.fromTaskEitherK = fromTaskEitherK;
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainTaskEitherKW = function (f) { return function (ma) { return function_1.pipe(ma, exports.chainW(exports.fromTaskEitherK(f))); }; };
exports.chainTaskEitherKW = chainTaskEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainTaskEitherK = exports.chainTaskEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
var fromReaderTaskEitherK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.fromReaderTaskEither(f.apply(void 0, a));
}; };
exports.fromReaderTaskEitherK = fromReaderTaskEitherK;
/**
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainReaderTaskEitherKW = function (f) { return function (ma) { return function_1.pipe(ma, exports.chainW(exports.fromReaderTaskEitherK(f))); }; };
exports.chainReaderTaskEitherKW = chainReaderTaskEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainReaderTaskEitherK = exports.chainReaderTaskEitherKW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function (s) {
    return function_1.pipe(fa(s), RTE.alt(function () { return that()(s); }));
}; };
var _bimap = function (fea, f, g) { return function (s) {
    return function_1.pipe(fea(s), RTE.bimap(f, function (_a) {
        var a = _a[0], s = _a[1];
        return [g(a), s];
    }));
}; };
var _mapLeft = function (fea, f) { return function (s) { return function_1.pipe(fea(s), RTE.mapLeft(f)); }; };
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
ST.map(RTE.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
var bimap = function (f, g) { return function (fa) {
    return _bimap(fa, f, g);
}; };
exports.bimap = bimap;
/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
var mapLeft = function (f) { return function (fa) {
    return _mapLeft(fa, f);
}; };
exports.mapLeft = mapLeft;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = 
/*#__PURE__*/
ST.ap(RTE.Chain);
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
ST.chain(RTE.Chain);
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
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) { return function (r) {
    return function_1.pipe(fa(r), RTE.altW(function () { return that()(r); }));
}; }; };
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.6.2
 */
exports.alt = exports.altW;
/**
 * @category MonadThrow
 * @since 2.7.0
 */
exports.throwError = exports.left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'StateReaderTaskEither';
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
 * @since 2.11.0
 */
exports.FromState = {
    URI: exports.URI,
    fromState: exports.fromState
};
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.get = 
/*#__PURE__*/
FromState_1.get(exports.FromState);
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.put = 
/*#__PURE__*/
FromState_1.put(exports.FromState);
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.modify = 
/*#__PURE__*/
FromState_1.modify(exports.FromState);
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.gets = 
/*#__PURE__*/
FromState_1.gets(exports.FromState);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.fromStateK = 
/*#__PURE__*/
FromState_1.fromStateK(exports.FromState);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainStateK = 
/*#__PURE__*/
FromState_1.chainStateK(exports.FromState, exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
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
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
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
    ap: _ap,
    of: exports.of,
    chain: _chain,
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
 * @since 2.11.0
 */
exports.ask = 
/*#__PURE__*/
FromReader_1.ask(exports.FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
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
 * Less strict version of [`chainReaderK`](#chainReaderK).
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
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.chainFirstReaderKW = exports.chainFirstReaderK;
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
 * @since 2.4.4
 */
exports.fromPredicate = 
/*#__PURE__*/
FromEither_1.fromPredicate(exports.FromEither);
/**
 * @category combinators
 * @since 2.4.4
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
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
exports.evaluate = 
/*#__PURE__*/
ST.evaluate(RTE.Functor);
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
exports.execute = 
/*#__PURE__*/
ST.execute(RTE.Functor);
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
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function (s) { return function (r) { return function () {
    return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (ebs) {
            return _.isLeft(ebs)
                ? acc
                : f(i + 1, a)(ebs.right[1])(r)().then(function (eb) {
                    if (_.isLeft(eb)) {
                        return eb;
                    }
                    var _a = eb.right, b = _a[0], s = _a[1];
                    ebs.right[0].push(b);
                    ebs.right[1] = s;
                    return ebs;
                });
        });
    }, f(0, _.head(as))(s)(r)().then(E.map(function (_a) {
        var b = _a[0], s = _a[1];
        return [[b], s];
    })));
}; }; }; }; };
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.of(_.emptyReadonlyArray)); };
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
exports.stateReaderTaskEither = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
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
exports.stateReaderTaskEitherSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
var evalState = function (fsa, s) {
    return function_1.pipe(fsa(s), RTE.map(function (_a) {
        var a = _a[0];
        return a;
    }));
};
exports.evalState = evalState;
/**
 * Use [`execute`](#execute) instead
 *
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
var execState = function (fsa, s) {
    return function_1.pipe(fsa(s), RTE.map(function (_a) {
        var _ = _a[0], s = _a[1];
        return s;
    }));
};
exports.execState = execState;
/**
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
function run(ma, s, r) {
    return ma(s)(r)();
}
exports.run = run;
