import { eqStrict } from './Eq';
import { constant, constTrue, pipe } from './function';
// -------------------------------------------------------------------------------------
// defaults
// -------------------------------------------------------------------------------------
/**
 * @category defaults
 * @since 2.10.0
 */
export var equalsDefault = function (compare) { return function (first, second) {
    return first === second || compare(first, second) === 0;
}; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export var fromCompare = function (compare) { return ({
    equals: equalsDefault(compare),
    compare: function (first, second) { return (first === second ? 0 : compare(first, second)); }
}); };
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
export var tuple = function () {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    return fromCompare(function (first, second) {
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
/**
 * @category combinators
 * @since 2.10.0
 */
export var reverse = function (O) { return fromCompare(function (first, second) { return O.compare(second, first); }); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var contramap_ = function (fa, f) { return pipe(fa, contramap(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.0.0
 */
export var contramap = function (f) { return function (fa) {
    return fromCompare(function (first, second) { return fa.compare(f(first), f(second)); });
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'Ord';
/**
 * @category instances
 * @since 2.0.0
 */
export var getSemigroup = function () { return ({
    concat: function (first, second) {
        return fromCompare(function (a, b) {
            var ox = first.compare(a, b);
            return ox !== 0 ? ox : second.compare(a, b);
        });
    }
}); };
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
export var getMonoid = function () { return ({
    concat: getSemigroup().concat,
    empty: fromCompare(function () { return 0; })
}); };
/**
 * @category instances
 * @since 2.7.0
 */
export var Contravariant = {
    URI: URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export var trivial = {
    equals: constTrue,
    compare: 
    /*#__PURE__*/
    constant(0)
};
/**
 * @since 2.11.0
 */
export var equals = function (O) { return function (second) { return function (first) {
    return first === second || O.compare(first, second) === 0;
}; }; };
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
export var lt = function (O) { return function (first, second) { return O.compare(first, second) === -1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
export var gt = function (O) { return function (first, second) { return O.compare(first, second) === 1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
export var leq = function (O) { return function (first, second) { return O.compare(first, second) !== 1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
export var geq = function (O) { return function (first, second) { return O.compare(first, second) !== -1; }; };
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
export var min = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) < 1 ? first : second;
}; };
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
export var max = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) > -1 ? first : second;
}; };
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
export var clamp = function (O) {
    var minO = min(O);
    var maxO = max(O);
    return function (low, hi) { return function (a) { return maxO(minO(a, hi), low); }; };
};
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
export var between = function (O) {
    var ltO = lt(O);
    var gtO = gt(O);
    return function (low, hi) { return function (a) { return (ltO(a, low) || gtO(a, hi) ? false : true); }; };
};
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
export var getTupleOrd = tuple;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
export var getDualOrd = reverse;
/**
 * Use [`Contravariant`](#contravariant) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var ord = Contravariant;
// default compare for primitive types
function compare(first, second) {
    return first < second ? -1 : first > second ? 1 : 0;
}
var strictOrd = {
    equals: eqStrict.equals,
    compare: compare
};
/**
 * Use [`Ord`](./boolean.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var ordBoolean = strictOrd;
/**
 * Use [`Ord`](./string.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var ordString = strictOrd;
/**
 * Use [`Ord`](./number.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var ordNumber = strictOrd;
/**
 * Use [`Ord`](./Date.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var ordDate = 
/*#__PURE__*/
pipe(ordNumber, 
/*#__PURE__*/
contramap(function (date) { return date.valueOf(); }));
