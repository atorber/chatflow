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
exports.MonadIO = exports.Monad = exports.Alternative = exports.guard = exports.Zero = exports.Alt = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.separate = exports.compact = exports.none = exports.zero = exports.altW = exports.alt = exports.flatten = exports.chain = exports.of = exports.ap = exports.map = exports.chainOptionK = exports.fromOptionK = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.toNullable = exports.toUndefined = exports.getOrElseW = exports.getOrElse = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromIOEither = exports.fromIO = exports.fromEither = exports.fromOption = exports.fromPredicate = exports.some = void 0;
exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.FromEither = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.Filterable = exports.Compactable = void 0;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var Compactable_1 = require("./Compactable");
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var O = __importStar(require("./Option"));
var OT = __importStar(require("./OptionT"));
var I = __importStar(require("./IO"));
var Zero_1 = require("./Zero");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.12.0
 */
exports.some = 
/*#__PURE__*/
OT.some(I.Pointed);
/**
 * @category constructors
 * @since 2.12.0
 */
exports.fromPredicate = 
/*#__PURE__*/
OT.fromPredicate(I.Pointed);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.12.0
 */
exports.fromOption = I.of;
/**
 * @category natural transformations
 * @since 2.12.0
 */
exports.fromEither = 
/*#__PURE__*/
OT.fromEither(I.Pointed);
/**
 * @category natural transformations
 * @since 2.12.0
 */
exports.fromIO = 
/*#__PURE__*/
OT.fromF(I.Functor);
/**
 * @category natural transformations
 * @since 2.12.0
 */
exports.fromIOEither = 
/*#__PURE__*/
I.map(O.fromEither);
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.12.0
 */
exports.match = 
/*#__PURE__*/
OT.match(I.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.12.0
 */
exports.matchW = exports.match;
/**
 * @category destructors
 * @since 2.12.0
 */
exports.matchE = 
/*#__PURE__*/
OT.matchE(I.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.12.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.12.0
 */
exports.matchEW = exports.matchE;
/**
 * @category destructors
 * @since 2.12.0
 */
exports.getOrElse = 
/*#__PURE__*/
OT.getOrElse(I.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.12.0
 */
exports.getOrElseW = exports.getOrElse;
/**
 * @category destructors
 * @since 2.12.0
 */
exports.toUndefined = I.map(O.toUndefined);
/**
 * @category destructors
 * @since 2.12.0
 */
exports.toNullable = I.map(O.toNullable);
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * @category interop
 * @since 2.12.0
 */
exports.fromNullable = 
/*#__PURE__*/
OT.fromNullable(I.Pointed);
/**
 * @category interop
 * @since 2.12.0
 */
exports.fromNullableK = 
/*#__PURE__*/
OT.fromNullableK(I.Pointed);
/**
 * @category interop
 * @since 2.12.0
 */
exports.chainNullableK = 
/*#__PURE__*/
OT.chainNullableK(I.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.12.0
 */
exports.fromOptionK = 
/*#__PURE__*/
OT.fromOptionK(I.Pointed);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainOptionK = 
/*#__PURE__*/
OT.chainOptionK(I.Monad);
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.12.0
 */
exports.map = 
/*#__PURE__*/
OT.map(I.Functor);
/**
 * @category Apply
 * @since 2.12.0
 */
exports.ap = 
/*#__PURE__*/
OT.ap(I.Apply);
/**
 * @category Pointed
 * @since 2.12.0
 */
exports.of = exports.some;
/**
 * @category Monad
 * @since 2.12.0
 */
exports.chain = 
/*#__PURE__*/
OT.chain(I.Monad);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.12.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(function_1.identity);
/**
 * @category Alt
 * @since 2.12.0
 */
exports.alt = 
/*#__PURE__*/
OT.alt(I.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.12.0
 */
exports.altW = exports.alt;
/**
 * @category Zero
 * @since 2.12.0
 */
exports.zero = 
/*#__PURE__*/
OT.zero(I.Pointed);
/**
 * @category constructors
 * @since 2.12.0
 */
exports.none = 
/*#__PURE__*/
exports.zero();
/**
 * @category Compactable
 * @since 2.12.0
 */
exports.compact = 
/*#__PURE__*/
Compactable_1.compact(I.Functor, O.Compactable);
/**
 * @category Compactable
 * @since 2.12.0
 */
exports.separate = 
/*#__PURE__*/
Compactable_1.separate(I.Functor, O.Compactable, O.Functor);
/**
 * @category Filterable
 * @since 2.12.0
 */
exports.filter = 
/*#__PURE__*/
Filterable_1.filter(I.Functor, O.Filterable);
/**
 * @category Filterable
 * @since 2.12.0
 */
exports.filterMap = 
/*#__PURE__*/
Filterable_1.filterMap(I.Functor, O.Filterable);
/**
 * @category Filterable
 * @since 2.12.0
 */
exports.partition = 
/*#__PURE__*/
Filterable_1.partition(I.Functor, O.Filterable);
/**
 * @category Filterable
 * @since 2.12.0
 */
exports.partitionMap = 
/*#__PURE__*/
Filterable_1.partitionMap(I.Functor, O.Filterable);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
/* istanbul ignore next */
var _filter = function (fa, predicate) { return function_1.pipe(fa, exports.filter(predicate)); };
/* istanbul ignore next */
var _filterMap = function (fa, f) { return function_1.pipe(fa, exports.filterMap(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return function_1.pipe(fa, exports.partition(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return function_1.pipe(fa, exports.partitionMap(f)); };
/**
 * @category instances
 * @since 2.12.0
 */
var URI = 'IOOption';
/**
 * @category instances
 * @since 2.12.0
 */
exports.Functor = {
    URI: URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.12.0
 */
exports.flap = 
/*#__PURE__*/
Functor_1.flap(exports.Functor);
/**
 * @category instances
 * @since 2.12.0
 */
exports.Pointed = {
    URI: URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Apply = {
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
 * @since 2.12.0
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
 * @since 2.12.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply_1.apSecond(exports.Apply);
/**
 * @category instances
 * @since 2.12.0
 */
exports.Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Chain = {
    URI: URI,
    map: _map,
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
 * @since 2.12.0
 */
exports.chainFirst = 
/*#__PURE__*/
Chain_1.chainFirst(exports.Chain);
/**
 * @category instances
 * @since 2.12.0
 */
exports.Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Zero = {
    URI: URI,
    zero: exports.zero
};
/**
 * @category constructors
 * @since 2.12.0
 */
exports.guard = 
/*#__PURE__*/
Zero_1.guard(exports.Zero, exports.Pointed);
/**
 * @category instances
 * @since 2.12.0
 */
exports.Alternative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    alt: _alt,
    zero: exports.zero
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.MonadIO = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Compactable = {
    URI: URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Filterable = {
    URI: URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.FromIO = {
    URI: URI,
    fromIO: exports.fromIO
};
/**
 * @category combinators
 * @since 2.12.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO_1.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainIOK = 
/*#__PURE__*/
FromIO_1.chainIOK(exports.FromIO, exports.Chain);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainFirstIOK = 
/*#__PURE__*/
FromIO_1.chainFirstIOK(exports.FromIO, exports.Chain);
/**
 * @category instances
 * @since 2.12.0
 */
exports.FromEither = {
    URI: URI,
    fromEither: exports.fromEither
};
/**
 * @category combinators
 * @since 2.12.0
 */
exports.fromEitherK = 
/*#__PURE__*/
FromEither_1.fromEitherK(exports.FromEither);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainEitherK = 
/*#__PURE__*/
FromEither_1.chainEitherK(exports.FromEither, exports.Chain);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainFirstEitherK = 
/*#__PURE__*/
FromEither_1.chainFirstEitherK(exports.FromEither, exports.Chain);
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.12.0
 */
exports.Do = 
/*#__PURE__*/
exports.of(_.emptyRecord);
/**
 * @since 2.12.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor_1.bindTo(exports.Functor);
/**
 * @since 2.12.0
 */
exports.bind = 
/*#__PURE__*/
Chain_1.bind(exports.Chain);
// -------------------------------------------------------------------------------------
// sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.12.0
 */
exports.apS = 
/*#__PURE__*/
Apply_1.apS(exports.Apply);
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.12.0
 */
exports.ApT = 
/*#__PURE__*/
exports.of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.12.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function_1.flow(I.traverseReadonlyNonEmptyArrayWithIndex(f), I.map(O.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * @since 2.12.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
