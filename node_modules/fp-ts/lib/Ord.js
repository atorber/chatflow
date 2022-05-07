"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordDate = exports.ordNumber = exports.ordString = exports.ordBoolean = exports.ord = exports.getDualOrd = exports.getTupleOrd = exports.between = exports.clamp = exports.max = exports.min = exports.geq = exports.leq = exports.gt = exports.lt = exports.equals = exports.trivial = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.URI = exports.contramap = exports.reverse = exports.tuple = exports.fromCompare = exports.equalsDefault = void 0;
var Eq_1 = require("./Eq");
var function_1 = require("./function");
// -------------------------------------------------------------------------------------
// defaults
// -------------------------------------------------------------------------------------
/**
 * @category defaults
 * @since 2.10.0
 */
var equalsDefault = function (compare) { return function (first, second) {
    return first === second || compare(first, second) === 0;
}; };
exports.equalsDefault = equalsDefault;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromCompare = function (compare) { return ({
    equals: exports.equalsDefault(compare),
    compare: function (first, second) { return (first === second ? 0 : compare(first, second)); }
}); };
exports.fromCompare = fromCompare;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Ord'
 * import * as B from 'fp-ts/boolean'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 *
 * const O = tuple(S.Ord, N.Ord, B.Ord)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple = function () {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    return exports.fromCompare(function (first, second) {
        var i = 0;
        for (; i < ords.length - 1; i++) {
            var r = ords[i].compare(first[i], second[i]);
            if (r !== 0) {
                return r;
            }
        }
        return ords[i].compare(first[i], second[i]);
    });
};
exports.tuple = tuple;
/**
 * @category combinators
 * @since 2.10.0
 */
var reverse = function (O) { return exports.fromCompare(function (first, second) { return O.compare(second, first); }); };
exports.reverse = reverse;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var contramap_ = function (fa, f) { return function_1.pipe(fa, exports.contramap(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.0.0
 */
var contramap = function (f) { return function (fa) {
    return exports.fromCompare(function (first, second) { return fa.compare(f(first), f(second)); });
}; };
exports.contramap = contramap;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Ord';
/**
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function () { return ({
    concat: function (first, second) {
        return exports.fromCompare(function (a, b) {
            var ox = first.compare(a, b);
            return ox !== 0 ? ox : second.compare(a, b);
        });
    }
}); };
exports.getSemigroup = getSemigroup;
/**
 * Returns a `Monoid` such that:
 *
 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
 * - its `empty` value is an `Ord` that always considers compared elements equal
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import { contramap, reverse, getMonoid } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as B from 'fp-ts/boolean'
 * import { pipe } from 'fp-ts/function'
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface User {
 *   readonly id: number
 *   readonly name: string
 *   readonly age: number
 *   readonly rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   S.Ord,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   N.Ord,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   B.Ord,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const M = getMonoid<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = concatAll(M)([byName, byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = concatAll(M)([reverse(byRememberMe), byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @category instances
 * @since 2.4.0
 */
var getMonoid = function () { return ({
    concat: exports.getSemigroup().concat,
    empty: exports.fromCompare(function () { return 0; })
}); };
exports.getMonoid = getMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Contravariant = {
    URI: exports.URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.trivial = {
    equals: function_1.constTrue,
    compare: 
    /*#__PURE__*/
    function_1.constant(0)
};
/**
 * @since 2.11.0
 */
var equals = function (O) { return function (second) { return function (first) {
    return first === second || O.compare(first, second) === 0;
}; }; };
exports.equals = equals;
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
var lt = function (O) { return function (first, second) { return O.compare(first, second) === -1; }; };
exports.lt = lt;
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
var gt = function (O) { return function (first, second) { return O.compare(first, second) === 1; }; };
exports.gt = gt;
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
var leq = function (O) { return function (first, second) { return O.compare(first, second) !== 1; }; };
exports.leq = leq;
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
var geq = function (O) { return function (first, second) { return O.compare(first, second) !== -1; }; };
exports.geq = geq;
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var min = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) < 1 ? first : second;
}; };
exports.min = min;
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var max = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) > -1 ? first : second;
}; };
exports.max = max;
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
var clamp = function (O) {
    var minO = exports.min(O);
    var maxO = exports.max(O);
    return function (low, hi) { return function (a) { return maxO(minO(a, hi), low); }; };
};
exports.clamp = clamp;
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
var between = function (O) {
    var ltO = exports.lt(O);
    var gtO = exports.gt(O);
    return function (low, hi) { return function (a) { return (ltO(a, low) || gtO(a, hi) ? false : true); }; };
};
exports.between = between;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleOrd = exports.tuple;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
exports.getDualOrd = exports.reverse;
/**
 * Use [`Contravariant`](#contravariant) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.ord = exports.Contravariant;
// default compare for primitive types
function compare(first, second) {
    return first < second ? -1 : first > second ? 1 : 0;
}
var strictOrd = {
    equals: Eq_1.eqStrict.equals,
    compare: compare
};
/**
 * Use [`Ord`](./boolean.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.ordBoolean = strictOrd;
/**
 * Use [`Ord`](./string.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.ordString = strictOrd;
/**
 * Use [`Ord`](./number.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.ordNumber = strictOrd;
/**
 * Use [`Ord`](./Date.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.ordDate = 
/*#__PURE__*/
function_1.pipe(exports.ordNumber, 
/*#__PURE__*/
exports.contramap(function (date) { return date.valueOf(); }));
