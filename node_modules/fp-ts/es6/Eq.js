import { pipe } from './function';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export var fromEquals = function (equals) { return ({
    equals: function (x, y) { return x === y || equals(x, y); }
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.10.0
 */
export var struct = function (eqs) {
    return fromEquals(function (first, second) {
        for (var key in eqs) {
            if (!eqs[key].equals(first[key], second[key])) {
                return false;
            }
        }
        return true;
    });
};
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Eq'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import * as B from 'fp-ts/boolean'
 *
 * const E = tuple(S.Eq, N.Eq, B.Eq)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @category combinators
 * @since 2.10.0
 */
export var tuple = function () {
    var eqs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eqs[_i] = arguments[_i];
    }
    return fromEquals(function (first, second) { return eqs.every(function (E, i) { return E.equals(first[i], second[i]); }); });
};
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
    return fromEquals(function (x, y) { return fa.equals(f(x), f(y)); });
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'Eq';
/**
 * @category instances
 * @since 2.5.0
 */
export var eqStrict = {
    equals: function (a, b) { return a === b; }
};
var empty = {
    equals: function () { return true; }
};
/**
 * @category instances
 * @since 2.10.0
 */
export var getSemigroup = function () { return ({
    concat: function (x, y) { return fromEquals(function (a, b) { return x.equals(a, b) && y.equals(a, b); }); }
}); };
/**
 * @category instances
 * @since 2.6.0
 */
export var getMonoid = function () { return ({
    concat: getSemigroup().concat,
    empty: empty
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
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
export var getTupleEq = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
export var getStructEq = struct;
/**
 * Use [`eqStrict`](#eqstrict) instead
 *
 * @since 2.0.0
 * @deprecated
 */
export var strictEqual = eqStrict.equals;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var eq = Contravariant;
/**
 * Use [`Eq`](./boolean.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var eqBoolean = eqStrict;
/**
 * Use [`Eq`](./string.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var eqString = eqStrict;
/**
 * Use [`Eq`](./number.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var eqNumber = eqStrict;
/**
 * Use [`Eq`](./Date.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var eqDate = {
    equals: function (first, second) { return first.valueOf() === second.valueOf(); }
};
