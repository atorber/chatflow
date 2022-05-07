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
exports.fromEither = exports.MonadThrow = exports.throwError = exports.Witherable = exports.wilt = exports.wither = exports.Traversable = exports.sequence = exports.traverse = exports.Filterable = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.Compactable = exports.separate = exports.compact = exports.Extend = exports.extend = exports.Alternative = exports.guard = exports.Zero = exports.zero = exports.Alt = exports.alt = exports.altW = exports.Foldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.Monad = exports.Chain = exports.chain = exports.Applicative = exports.Apply = exports.ap = exports.Pointed = exports.of = exports.Functor = exports.map = exports.getMonoid = exports.getOrd = exports.getEq = exports.getShow = exports.URI = exports.getRight = exports.getLeft = exports.fromPredicate = exports.some = exports.none = void 0;
exports.getLastMonoid = exports.getFirstMonoid = exports.getApplyMonoid = exports.getApplySemigroup = exports.option = exports.mapNullable = exports.getRefinement = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.exists = exports.elem = exports.toUndefined = exports.toNullable = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.duplicate = exports.chainFirst = exports.flatten = exports.apSecond = exports.apFirst = exports.flap = exports.getOrElse = exports.getOrElseW = exports.fold = exports.match = exports.foldW = exports.matchW = exports.isNone = exports.isSome = exports.FromEither = void 0;
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var FromEither_1 = require("./FromEither");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var Predicate_1 = require("./Predicate");
var Semigroup_1 = require("./Semigroup");
var Separated_1 = require("./Separated");
var Witherable_1 = require("./Witherable");
var Zero_1 = require("./Zero");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.none = _.none;
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.some = _.some;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? exports.some(a) : exports.none); };
}
exports.fromPredicate = fromPredicate;
/**
 * Returns the `Left` value of an `Either` if possible.
 *
 * @example
 * import { getLeft, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 *
 * @category constructors
 * @since 2.0.0
 */
var getLeft = function (ma) { return (ma._tag === 'Right' ? exports.none : exports.some(ma.left)); };
exports.getLeft = getLeft;
/**
 * Returns the `Right` value of an `Either` if possible.
 *
 * @example
 * import { getRight, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(left('a')), none)
 *
 * @category constructors
 * @since 2.0.0
 */
var getRight = function (ma) { return (ma._tag === 'Left' ? exports.none : exports.some(ma.right)); };
exports.getRight = getRight;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
var _reduce = function (fa, b, f) { return function_1.pipe(fa, exports.reduce(b, f)); };
var _foldMap = function (M) {
    var foldMapM = exports.foldMap(M);
    return function (fa, f) { return function_1.pipe(fa, foldMapM(f)); };
};
var _reduceRight = function (fa, b, f) { return function_1.pipe(fa, exports.reduceRight(b, f)); };
var _traverse = function (F) {
    var traverseF = exports.traverse(F);
    return function (ta, f) { return function_1.pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
var _filter = function (fa, predicate) { return function_1.pipe(fa, exports.filter(predicate)); };
/* istanbul ignore next */
var _filterMap = function (fa, f) { return function_1.pipe(fa, exports.filterMap(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return function_1.pipe(wa, exports.extend(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return function_1.pipe(fa, exports.partition(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return function_1.pipe(fa, exports.partitionMap(f)); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Option';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow = function (S) { return ({
    show: function (ma) { return (exports.isNone(ma) ? 'none' : "some(" + S.show(ma.value) + ")"); }
}); };
exports.getShow = getShow;
/**
 * @example
 * import { none, some, getEq } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals(none, none), true)
 * assert.strictEqual(E.equals(none, some(1)), false)
 * assert.strictEqual(E.equals(some(1), none), false)
 * assert.strictEqual(E.equals(some(1), some(2)), false)
 * assert.strictEqual(E.equals(some(1), some(1)), true)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq = function (E) { return ({
    equals: function (x, y) { return x === y || (exports.isNone(x) ? exports.isNone(y) : exports.isNone(y) ? false : E.equals(x.value, y.value)); }
}); };
exports.getEq = getEq;
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const O = getOrd(N.Ord)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @category instances
 * @since 2.0.0
 */
var getOrd = function (O) { return ({
    equals: exports.getEq(O).equals,
    compare: function (x, y) { return (x === y ? 0 : exports.isSome(x) ? (exports.isSome(y) ? O.compare(x.value, y.value) : 1) : -1); }
}); };
exports.getOrd = getOrd;
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(b) | some(b)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/Option'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const M = getMonoid(SemigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getMonoid = function (S) { return ({
    concat: function (x, y) { return (exports.isNone(x) ? y : exports.isNone(y) ? x : exports.some(S.concat(x.value, y.value))); },
    empty: exports.none
}); };
exports.getMonoid = getMonoid;
/**
 * @category instance operations
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return exports.isNone(fa) ? exports.none : exports.some(f(fa.value));
}; };
exports.map = map;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * @category instance operations
 * @since 2.7.0
 */
exports.of = exports.some;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) {
    return exports.isNone(fab) ? exports.none : exports.isNone(fa) ? exports.none : exports.some(fab.value(fa.value));
}; };
exports.ap = ap;
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
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) {
    return exports.isNone(ma) ? exports.none : f(ma.value);
}; };
exports.chain = chain;
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
 * @category instance operations
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return exports.isNone(fa) ? b : f(b, fa.value);
}; };
exports.reduce = reduce;
/**
 * @category instance operations
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return exports.isNone(fa) ? M.empty : f(fa.value);
}; }; };
exports.foldMap = foldMap;
/**
 * @category instance operations
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return exports.isNone(fa) ? b : f(fa.value, b);
}; };
exports.reduceRight = reduceRight;
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
 * Less strict version of [`alt`](#alt).
 *
 * @category instance operations
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) {
    return exports.isNone(fa) ? that() : fa;
}; };
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Option` returns the left-most non-`None` value.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('a')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('b')
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
exports.alt = exports.altW;
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
 * @category instance operations
 * @since 2.7.0
 */
var zero = function () { return exports.none; };
exports.zero = zero;
/**
 * @category instances
 * @since 2.11.0
 */
exports.Zero = {
    URI: exports.URI,
    zero: exports.zero
};
/**
 * @category constructors
 * @since 2.11.0
 */
exports.guard = 
/*#__PURE__*/
Zero_1.guard(exports.Zero, exports.Pointed);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alternative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    alt: _alt,
    zero: exports.zero
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return exports.isNone(wa) ? exports.none : exports.some(f(wa));
}; };
exports.extend = extend;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: _map,
    extend: _extend
};
/**
 * @category instance operations
 * @since 2.0.0
 */
exports.compact = 
/*#__PURE__*/
exports.chain(function_1.identity);
var defaultSeparated = 
/*#__PURE__*/
Separated_1.separated(exports.none, exports.none);
/**
 * @category instance operations
 * @since 2.0.0
 */
var separate = function (ma) {
    return exports.isNone(ma) ? defaultSeparated : Separated_1.separated(exports.getLeft(ma.value), exports.getRight(ma.value));
};
exports.separate = separate;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var filter = function (predicate) { return function (fa) { return (exports.isNone(fa) ? exports.none : predicate(fa.value) ? fa : exports.none); }; };
exports.filter = filter;
/**
 * @category instance operations
 * @since 2.0.0
 */
var filterMap = function (f) { return function (fa) {
    return exports.isNone(fa) ? exports.none : f(fa.value);
}; };
exports.filterMap = filterMap;
/**
 * @category instance operations
 * @since 2.0.0
 */
var partition = function (predicate) { return function (fa) { return Separated_1.separated(_filter(fa, Predicate_1.not(predicate)), _filter(fa, predicate)); }; };
exports.partition = partition;
/**
 * @category instance operations
 * @since 2.0.0
 */
var partitionMap = function (f) { return function_1.flow(exports.map(f), exports.separate); };
exports.partitionMap = partitionMap;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Filterable = {
    URI: exports.URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instance operations
 * @since 2.6.3
 */
var traverse = function (F) { return function (f) { return function (ta) { return (exports.isNone(ta) ? F.of(exports.none) : F.map(f(ta.value), exports.some)); }; }; };
exports.traverse = traverse;
/**
 * @category instance operations
 * @since 2.6.3
 */
var sequence = function (F) { return function (ta) { return (exports.isNone(ta) ? F.of(exports.none) : F.map(ta.value, exports.some)); }; };
exports.sequence = sequence;
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
var _wither = 
/*#__PURE__*/
Witherable_1.witherDefault(exports.Traversable, exports.Compactable);
var _wilt = 
/*#__PURE__*/
Witherable_1.wiltDefault(exports.Traversable, exports.Compactable);
/**
 * @category instance operations
 * @since 2.6.5
 */
var wither = function (F) {
    var _witherF = _wither(F);
    return function (f) { return function (fa) { return _witherF(fa, f); }; };
};
exports.wither = wither;
/**
 * @category instance operations
 * @since 2.6.5
 */
var wilt = function (F) {
    var _wiltF = _wilt(F);
    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
};
exports.wilt = wilt;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Witherable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: _wither,
    wilt: _wilt
};
/**
 * @category instance operations
 * @since 2.7.0
 */
var throwError = function () { return exports.none; };
exports.throwError = throwError;
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
 * Transforms an `Either` to an `Option` discarding the error.
 *
 * Alias of [getRight](#getright)
 *
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromEither = exports.getRight;
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise.
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isSome = _.isSome;
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 2.0.0
 */
var isNone = function (fa) { return fa._tag === 'None'; };
exports.isNone = isNone;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW = function (onNone, onSome) { return function (ma) {
    return exports.isNone(ma) ? onNone() : onSome(ma.value);
}; };
exports.matchW = matchW;
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.foldW = exports.matchW;
/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, match } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
exports.match = exports.matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
exports.fold = exports.match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW = function (onNone) { return function (ma) { return (exports.isNone(ma) ? onNone() : ma.value); }; };
exports.getOrElseW = getOrElseW;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = exports.getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
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
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = exports.compact;
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
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.duplicate = 
/*#__PURE__*/
exports.extend(function_1.identity);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.fromEitherK = 
/*#__PURE__*/
FromEither_1.fromEitherK(exports.FromEither);
/**
 * @category combinators
 * @since 2.11.0
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
// interop
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable = function (a) { return (a == null ? exports.none : exports.some(a)); };
exports.fromNullable = fromNullable;
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
 * `Some`.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f) {
    try {
        return exports.some(f());
    }
    catch (e) {
        return exports.none;
    }
};
exports.tryCatch = tryCatch;
/**
 * Converts a function that may throw to one returning a `Option`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.tryCatch(function () { return f.apply(void 0, a); });
}; };
exports.tryCatchK = tryCatchK;
/**
 * Returns a *smart constructor* from a function that returns a nullable value.
 *
 * @example
 * import { fromNullableK, none, some } from 'fp-ts/Option'
 *
 * const f = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const g = fromNullableK(f)
 *
 * assert.deepStrictEqual(g('1'), some(1))
 * assert.deepStrictEqual(g('a'), none)
 *
 * @category interop
 * @since 2.9.0
 */
var fromNullableK = function (f) { return function_1.flow(f, exports.fromNullable); };
exports.fromNullableK = fromNullableK;
/**
 * This is `chain` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, fromNullable, chainNullableK } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Employee {
 *   readonly company?: {
 *     readonly address?: {
 *       readonly street?: {
 *         readonly name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   none
 * )
 *
 * @category interop
 * @since 2.9.0
 */
var chainNullableK = function (f) { return function (ma) {
    return exports.isNone(ma) ? exports.none : exports.fromNullable(f(ma.value));
}; };
exports.chainNullableK = chainNullableK;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNullable } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNullable
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNullable
 *   ),
 *   null
 * )
 *
 * @category interop
 * @since 2.0.0
 */
exports.toNullable = 
/*#__PURE__*/
exports.match(function_1.constNull, function_1.identity);
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @category interop
 * @since 2.0.0
 */
exports.toUndefined = 
/*#__PURE__*/
exports.match(function_1.constUndefined, function_1.identity);
function elem(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return exports.isNone(ma) ? false : E.equals(a, ma.value);
    };
}
exports.elem = elem;
/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 2.0.0
 */
var exists = function (predicate) { return function (ma) {
    return exports.isNone(ma) ? false : predicate(ma.value);
}; };
exports.exists = exists;
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
var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) {
    var o = f(0, _.head(as));
    if (exports.isNone(o)) {
        return exports.none;
    }
    var out = [o.value];
    for (var i = 1; i < as.length; i++) {
        var o_1 = f(i, as[i]);
        if (exports.isNone(o_1)) {
            return exports.none;
        }
        out.push(o_1.value);
    }
    return exports.some(out);
}; };
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
 * Use `Refinement` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
function getRefinement(getOption) {
    return function (a) { return exports.isSome(getOption(a)); };
}
exports.getRefinement = getRefinement;
/**
 * Use [`chainNullableK`](#chainnullablek) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
exports.mapNullable = exports.chainNullableK;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.option = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    zero: exports.zero,
    alt: _alt,
    extend: _extend,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: _wither,
    wilt: _wilt,
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
Apply_1.getApplySemigroup(exports.Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/
Applicative_1.getApplicativeMonoid(exports.Applicative);
/**
 * Use
 *
 * ```ts
 * import { first } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(first())
 * ```
 *
 * instead.
 *
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFirstMonoid = function () { return exports.getMonoid(Semigroup_1.first()); };
exports.getFirstMonoid = getFirstMonoid;
/**
 * Use
 *
 * ```ts
 * import { last } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(last())
 * ```
 *
 * instead.
 *
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getLastMonoid = function () { return exports.getMonoid(Semigroup_1.last()); };
exports.getLastMonoid = getLastMonoid;
