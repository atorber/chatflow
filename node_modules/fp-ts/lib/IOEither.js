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
exports.apSecond = exports.apFirstW = exports.apFirst = exports.ApplyPar = exports.Bifunctor = exports.Pointed = exports.flap = exports.Functor = exports.getFilterable = exports.getCompactable = exports.getAltIOValidation = exports.getApplicativeIOValidation = exports.URI = exports.throwError = exports.altW = exports.alt = exports.flatten = exports.flattenW = exports.chainW = exports.chain = exports.of = exports.apW = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.swap = exports.orLeft = exports.orElseFirstIOK = exports.orElseFirstW = exports.orElseFirst = exports.orElseW = exports.orElse = exports.toUnion = exports.tryCatchK = exports.tryCatch = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromIO = exports.fromEither = exports.leftIO = exports.rightIO = exports.right = exports.left = void 0;
exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.ioEither = exports.Applicative = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.bracketW = exports.bracket = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.FromEither = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.MonadThrow = exports.MonadIO = exports.Alt = exports.chainFirstW = exports.chainFirst = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplicativePar = exports.apSecondW = void 0;
exports.getIOValidation = void 0;
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var Compactable_1 = require("./Compactable");
var E = __importStar(require("./Either"));
var ET = __importStar(require("./EitherT"));
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var I = __importStar(require("./IO"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = 
/*#__PURE__*/
ET.left(I.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = 
/*#__PURE__*/
ET.right(I.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = 
/*#__PURE__*/
ET.rightF(I.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = 
/*#__PURE__*/
ET.leftF(I.Functor);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromEither = I.of;
/**
 * @category natural transformations
 * @since 2.7.0
 */
exports.fromIO = exports.rightIO;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/
ET.match(I.Functor);
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
ET.matchE(I.Monad);
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
ET.getOrElse(I.Monad);
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
 * Constructs a new `IOEither` from a function that performs a side effect and might throw
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onThrow) { return function () {
    return E.tryCatch(f, onThrow);
}; };
exports.tryCatch = tryCatch;
/**
 * Converts a function that may throw to one returning a `IOEither`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f, onThrow) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.tryCatch(function () { return f.apply(void 0, a); }, onThrow);
}; };
exports.tryCatchK = tryCatchK;
/**
 * @category interop
 * @since 2.10.0
 */
exports.toUnion = 
/*#__PURE__*/
ET.toUnion(I.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.0.0
 */
exports.orElse = 
/*#__PURE__*/
ET.orElse(I.Monad);
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
ET.orElseFirst(I.Monad);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orElseFirstW = exports.orElseFirst;
/**
 * @category combinators
 * @since 2.12.0
 */
var orElseFirstIOK = function (onLeft) {
    return exports.orElseFirst(exports.fromIOK(onLeft));
};
exports.orElseFirstIOK = orElseFirstIOK;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orLeft = 
/*#__PURE__*/
ET.orLeft(I.Monad);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.swap = 
/*#__PURE__*/
ET.swap(I.Functor);
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var _apSeq = function (fab, fa) {
    return function_1.pipe(fab, exports.chain(function (f) { return function_1.pipe(fa, exports.map(f)); }));
};
/* istanbul ignore next */
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return function_1.pipe(fa, exports.bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return function_1.pipe(fa, exports.mapLeft(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
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
ET.map(I.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.bimap = 
/*#__PURE__*/
ET.bimap(I.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.mapLeft = 
/*#__PURE__*/
ET.mapLeft(I.Functor);
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = 
/*#__PURE__*/
ET.ap(I.Apply);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category Pointed
 * @since 2.8.5
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
ET.chain(I.Monad);
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
ET.alt(I.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
exports.altW = exports.alt;
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
exports.URI = 'IOEither';
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeIOValidation(S) {
    var ap = Apply_1.ap(I.Apply, E.getApplicativeValidation(S));
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return function_1.pipe(fab, ap(fa)); },
        of: exports.of
    };
}
exports.getApplicativeIOValidation = getApplicativeIOValidation;
/**
 * @category instances
 * @since 2.7.0
 */
function getAltIOValidation(S) {
    var alt = ET.altValidation(I.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return function_1.pipe(fa, alt(that)); }
    };
}
exports.getAltIOValidation = getAltIOValidation;
/**
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: Compactable_1.compact(I.Functor, C),
        separate: Compactable_1.separate(I.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category instances
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = exports.getCompactable(M);
    var filter = Filterable_1.filter(I.Functor, F);
    var filterMap = Filterable_1.filterMap(I.Functor, F);
    var partition = Filterable_1.partition(I.Functor, F);
    var partitionMap = Filterable_1.partitionMap(I.Functor, F);
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
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
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
 * @since 2.8.4
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.8.4
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
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
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
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    throwError: exports.throwError
};
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) { return exports.bracketW(acquire, use, release); };
exports.bracket = bracket;
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
var bracketW = function (acquire, use, release) {
    return function_1.pipe(acquire, exports.chainW(function (a) {
        return function_1.pipe(use(a), I.chain(function (e) {
            return function_1.pipe(release(a, e), exports.chainW(function () { return I.of(e); }));
        }));
    }));
};
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
    return function_1.flow(I.traverseReadonlyNonEmptyArrayWithIndex(f), I.map(E.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
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
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) { return function (as) { return function () {
    var e = f(0, _.head(as))();
    if (_.isLeft(e)) {
        return e;
    }
    var out = [e.right];
    for (var i = 1; i < as.length; i++) {
        var e_1 = f(i, as[i])();
        if (_.isLeft(e_1)) {
            return e_1;
        }
        out.push(e_1.right);
    }
    return _.right(out);
}; }; };
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
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
var traverseSeqArray = function (f) { return exports.traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
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
 * Use [`ApplicativePar`](#applicativepar) instead
 *
 * @since 2.7.0
 * @category instances
 * @deprecated
 */
exports.Applicative = exports.ApplicativePar;
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
exports.ioEither = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    alt: _alt,
    fromIO: exports.fromIO,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/
Apply_1.getApplySemigroup(exports.ApplyPar);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/
Applicative_1.getApplicativeMonoid(exports.ApplicativePar);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup = function (S) {
    return Apply_1.getApplySemigroup(I.Apply)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeIOValidation`](#getapplicativeiovalidation) and [`getAltIOValidation`](#getaltiovalidation).
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getIOValidation(SE) {
    var applicativeIOValidation = getApplicativeIOValidation(SE);
    var altIOValidation = getAltIOValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: applicativeIOValidation.ap,
        of: exports.of,
        chain: _chain,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: altIOValidation.alt,
        fromIO: exports.fromIO,
        throwError: exports.throwError
    };
}
exports.getIOValidation = getIOValidation;
