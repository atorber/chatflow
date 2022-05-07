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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceRight = exports.foldMap = exports.reduce = exports.mapWithIndex = exports.map = exports.flatten = exports.duplicate = exports.extend = exports.chain = exports.ap = exports.alt = exports.altW = exports.of = exports.chunksOf = exports.splitAt = exports.chop = exports.chainWithIndex = exports.intersperse = exports.prependAll = exports.unzip = exports.zip = exports.zipWith = exports.modifyAt = exports.updateAt = exports.sort = exports.groupBy = exports.group = exports.reverse = exports.concat = exports.concatW = exports.fromArray = exports.unappend = exports.unprepend = exports.range = exports.replicate = exports.makeBy = exports.fromReadonlyArray = exports.rotate = exports.union = exports.sortBy = exports.uniq = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.append = exports.appendW = exports.prepend = exports.prependW = exports.isOutOfBound = exports.isNonEmpty = exports.empty = void 0;
exports.filterWithIndex = exports.filter = exports.groupSort = exports.intercalate = exports.updateLast = exports.modifyLast = exports.updateHead = exports.modifyHead = exports.matchRight = exports.matchLeft = exports.concatAll = exports.max = exports.min = exports.init = exports.last = exports.tail = exports.head = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.Comonad = exports.Alt = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.Monad = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getUnionSemigroup = exports.getEq = exports.getSemigroup = exports.getShow = exports.URI = exports.extract = exports.traverseWithIndex = exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.foldMapWithIndex = exports.reduceWithIndex = void 0;
exports.readonlyNonEmptyArray = exports.fold = exports.prependToAll = exports.insertAt = exports.snoc = exports.cons = exports.unsnoc = exports.uncons = void 0;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var Eq_1 = require("./Eq");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var Ord_1 = require("./Ord");
var Se = __importStar(require("./Semigroup"));
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
exports.empty = _.emptyReadonlyArray;
/**
 * @internal
 */
exports.isNonEmpty = _.isNonEmpty;
/**
 * @internal
 */
var isOutOfBound = function (i, as) { return i < 0 || i >= as.length; };
exports.isOutOfBound = isOutOfBound;
/**
 * @internal
 */
var prependW = function (head) { return function (tail) { return __spreadArray([head], tail); }; };
exports.prependW = prependW;
/**
 * @internal
 */
exports.prepend = exports.prependW;
/**
 * @internal
 */
var appendW = function (end) { return function (init) { return __spreadArray(__spreadArray([], init), [end]); }; };
exports.appendW = appendW;
/**
 * @internal
 */
exports.append = exports.appendW;
/**
 * @internal
 */
var unsafeInsertAt = function (i, a, as) {
    if (exports.isNonEmpty(as)) {
        var xs = _.fromReadonlyNonEmptyArray(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
exports.unsafeInsertAt = unsafeInsertAt;
/**
 * @internal
 */
var unsafeUpdateAt = function (i, a, as) {
    if (as[i] === a) {
        return as;
    }
    else {
        var xs = _.fromReadonlyNonEmptyArray(as);
        xs[i] = a;
        return xs;
    }
};
exports.unsafeUpdateAt = unsafeUpdateAt;
/**
 * Remove duplicates from a `ReadonlyNonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @category combinators
 * @since 2.11.0
 */
var uniq = function (E) { return function (as) {
    if (as.length === 1) {
        return as;
    }
    var out = [exports.head(as)];
    var rest = exports.tail(as);
    var _loop_1 = function (a) {
        if (out.every(function (o) { return !E.equals(o, a); })) {
            out.push(a);
        }
    };
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var a = rest_1[_i];
        _loop_1(a);
    }
    return out;
}; };
exports.uniq = uniq;
/**
 * Sort the elements of a `ReadonlyNonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 *
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = RNEA.sortBy([byName, byAge])
 *
 * const persons: RNEA.ReadonlyNonEmptyArray<Person> = [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 },
 *   { name: 'b', age: 2 }
 * ]
 *
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @category combinators
 * @since 2.11.0
 */
var sortBy = function (ords) {
    if (exports.isNonEmpty(ords)) {
        var M = Ord_1.getMonoid();
        return exports.sort(ords.reduce(M.concat, M.empty));
    }
    return function_1.identity;
};
exports.sortBy = sortBy;
/**
 * @category combinators
 * @since 2.11.0
 */
var union = function (E) {
    var uniqE = exports.uniq(E);
    return function (second) { return function (first) { return uniqE(function_1.pipe(first, concat(second))); }; };
};
exports.union = union;
/**
 * Rotate a `ReadonlyNonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @category combinators
 * @since 2.11.0
 */
var rotate = function (n) { return function (as) {
    var len = as.length;
    var m = Math.round(n) % len;
    if (exports.isOutOfBound(Math.abs(m), as) || m === 0) {
        return as;
    }
    if (m < 0) {
        var _a = exports.splitAt(-m)(as), f = _a[0], s = _a[1];
        return function_1.pipe(s, concat(f));
    }
    else {
        return exports.rotate(m - len)(as);
    }
}; };
exports.rotate = rotate;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Return a `ReadonlyNonEmptyArray` from a `ReadonlyArray` returning `none` if the input is empty.
 *
 * @category constructors
 * @since 2.5.0
 */
var fromReadonlyArray = function (as) {
    return exports.isNonEmpty(as) ? _.some(as) : _.none;
};
exports.fromReadonlyArray = fromReadonlyArray;
/**
 * Return a `ReadonlyNonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
var makeBy = function (f) { return function (n) {
    var j = Math.max(0, Math.floor(n));
    var out = [f(0)];
    for (var i = 1; i < j; i++) {
        out.push(f(i));
    }
    return out;
}; };
exports.makeBy = makeBy;
/**
 * Create a `ReadonlyNonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
var replicate = function (a) { return exports.makeBy(function () { return a; }); };
exports.replicate = replicate;
/**
 * Create a `ReadonlyNonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
var range = function (start, end) {
    return start <= end ? exports.makeBy(function (i) { return start + i; })(end - start + 1) : [start];
};
exports.range = range;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
 *
 * @category destructors
 * @since 2.9.0
 */
var unprepend = function (as) { return [exports.head(as), exports.tail(as)]; };
exports.unprepend = unprepend;
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @category destructors
 * @since 2.9.0
 */
var unappend = function (as) { return [exports.init(as), exports.last(as)]; };
exports.unappend = unappend;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * @category interop
 * @since 2.5.0
 */
var fromArray = function (as) { return exports.fromReadonlyArray(as.slice()); };
exports.fromArray = fromArray;
function concatW(second) {
    return function (first) { return first.concat(second); };
}
exports.concatW = concatW;
function concat(x, y) {
    return y ? x.concat(y) : function (y) { return y.concat(x); };
}
exports.concat = concat;
/**
 * @category combinators
 * @since 2.5.0
 */
var reverse = function (as) {
    return as.length === 1 ? as : __spreadArray([exports.last(as)], as.slice(0, -1).reverse());
};
exports.reverse = reverse;
function group(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return exports.empty;
        }
        var out = [];
        var head = as[0];
        var nea = [head];
        for (var i = 1; i < len; i++) {
            var a = as[i];
            if (E.equals(a, head)) {
                nea.push(a);
            }
            else {
                out.push(nea);
                head = a;
                nea = [head];
            }
        }
        out.push(nea);
        return out;
    };
}
exports.group = group;
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @category combinators
 * @since 2.5.0
 */
var groupBy = function (f) { return function (as) {
    var out = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        var k = f(a);
        if (out.hasOwnProperty(k)) {
            out[k].push(a);
        }
        else {
            out[k] = [a];
        }
    }
    return out;
}; };
exports.groupBy = groupBy;
/**
 * @category combinators
 * @since 2.5.0
 */
var sort = function (O) { return function (as) {
    return as.length === 1 ? as : as.slice().sort(O.compare);
}; };
exports.sort = sort;
/**
 * @category combinators
 * @since 2.5.0
 */
var updateAt = function (i, a) {
    return exports.modifyAt(i, function () { return a; });
};
exports.updateAt = updateAt;
/**
 * @category combinators
 * @since 2.5.0
 */
var modifyAt = function (i, f) { return function (as) { return (exports.isOutOfBound(i, as) ? _.none : _.some(exports.unsafeUpdateAt(i, f(as[i]), as))); }; };
exports.modifyAt = modifyAt;
/**
 * @category combinators
 * @since 2.5.1
 */
var zipWith = function (as, bs, f) {
    var cs = [f(as[0], bs[0])];
    var len = Math.min(as.length, bs.length);
    for (var i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
exports.zipWith = zipWith;
function zip(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip(bs, as); };
    }
    return exports.zipWith(as, bs, function (a, b) { return [a, b]; });
}
exports.zip = zip;
/**
 * @category combinators
 * @since 2.5.1
 */
var unzip = function (abs) {
    var fa = [abs[0][0]];
    var fb = [abs[0][1]];
    for (var i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
exports.unzip = unzip;
/**
 * Prepend an element to every member of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll = function (middle) { return function (as) {
    var out = [middle, as[0]];
    for (var i = 1; i < as.length; i++) {
        out.push(middle, as[i]);
    }
    return out;
}; };
exports.prependAll = prependAll;
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse = function (middle) { return function (as) {
    var rest = exports.tail(as);
    return exports.isNonEmpty(rest) ? function_1.pipe(rest, exports.prependAll(middle), exports.prepend(exports.head(as))) : as;
}; };
exports.intersperse = intersperse;
/**
 * @category combinators
 * @since 2.10.0
 */
var chainWithIndex = function (f) { return function (as) {
    var out = _.fromReadonlyNonEmptyArray(f(0, exports.head(as)));
    for (var i = 1; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
exports.chainWithIndex = chainWithIndex;
/**
 * A useful recursion pattern for processing a `ReadonlyNonEmptyArray` to produce a new `ReadonlyNonEmptyArray`, often used for "chopping" up the input
 * `ReadonlyNonEmptyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyNonEmptyArray` and produce a
 * value and the tail of the `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.10.0
 */
var chop = function (f) { return function (as) {
    var _a = f(as), b = _a[0], rest = _a[1];
    var out = [b];
    var next = rest;
    while (exports.isNonEmpty(next)) {
        var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
        out.push(b_1);
        next = rest_2;
    }
    return out;
}; };
exports.chop = chop;
/**
 * Splits a `ReadonlyNonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category combinators
 * @since 2.10.0
 */
var splitAt = function (n) { return function (as) {
    var m = Math.max(1, n);
    return m >= as.length ? [as, exports.empty] : [function_1.pipe(as.slice(1, m), exports.prepend(exports.head(as))), as.slice(m)];
}; };
exports.splitAt = splitAt;
/**
 * Splits a `ReadonlyNonEmptyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.10.0
 */
var chunksOf = function (n) { return exports.chop(exports.splitAt(n)); };
exports.chunksOf = chunksOf;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
/* istanbul ignore next */
var _mapWithIndex = function (fa, f) { return function_1.pipe(fa, exports.mapWithIndex(f)); };
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return function_1.pipe(wa, exports.extend(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return function_1.pipe(fa, exports.reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = exports.foldMap(M);
    return function (fa, f) { return function_1.pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return function_1.pipe(fa, exports.reduceRight(b, f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = exports.traverse(F);
    return function (ta, f) { return function_1.pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
/* istanbul ignore next */
var _reduceWithIndex = function (fa, b, f) {
    return function_1.pipe(fa, exports.reduceWithIndex(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex = function (M) {
    var foldMapWithIndexM = exports.foldMapWithIndex(M);
    return function (fa, f) { return function_1.pipe(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex = function (fa, b, f) {
    return function_1.pipe(fa, exports.reduceRightWithIndex(b, f));
};
/* istanbul ignore next */
var _traverseWithIndex = function (F) {
    var traverseWithIndexF = exports.traverseWithIndex(F);
    return function (ta, f) { return function_1.pipe(ta, traverseWithIndexF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Pointed
 * @since 2.5.0
 */
exports.of = _.singleton;
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW = function (that) { return function (as) { return function_1.pipe(as, concatW(that())); }; };
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
 * @category Apply
 * @since 2.5.0
 */
var ap = function (as) { return exports.chain(function (f) { return function_1.pipe(as, exports.map(f)); }); };
exports.ap = ap;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.5.0
 */
var chain = function (f) { return exports.chainWithIndex(function (_, a) { return f(a); }); };
exports.chain = chain;
/**
 * @category Extend
 * @since 2.5.0
 */
var extend = function (f) { return function (as) {
    var next = exports.tail(as);
    var out = [f(as)];
    while (exports.isNonEmpty(next)) {
        out.push(f(next));
        next = exports.tail(next);
    }
    return out;
}; };
exports.extend = extend;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
exports.duplicate = 
/*#__PURE__*/
exports.extend(function_1.identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(function_1.identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.5.0
 */
var map = function (f) {
    return exports.mapWithIndex(function (_, a) { return f(a); });
};
exports.map = map;
/**
 * @category FunctorWithIndex
 * @since 2.5.0
 */
var mapWithIndex = function (f) { return function (as) {
    var out = [f(0, exports.head(as))];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i]));
    }
    return out;
}; };
exports.mapWithIndex = mapWithIndex;
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce = function (b, f) {
    return exports.reduceWithIndex(b, function (_, b, a) { return f(b, a); });
};
exports.reduce = reduce;
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category Foldable
 * @since 2.5.0
 */
var foldMap = function (S) { return function (f) { return function (as) {
    return as.slice(1).reduce(function (s, a) { return S.concat(s, f(a)); }, f(as[0]));
}; }; };
exports.foldMap = foldMap;
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight = function (b, f) {
    return exports.reduceRightWithIndex(b, function (_, b, a) { return f(b, a); });
};
exports.reduceRight = reduceRight;
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceWithIndex = function (b, f) { return function (as) {
    return as.reduce(function (b, a, i) { return f(i, b, a); }, b);
}; };
exports.reduceWithIndex = reduceWithIndex;
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var foldMapWithIndex = function (S) { return function (f) { return function (as) { return as.slice(1).reduce(function (s, a, i) { return S.concat(s, f(i + 1, a)); }, f(0, as[0])); }; }; };
exports.foldMapWithIndex = foldMapWithIndex;
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceRightWithIndex = function (b, f) { return function (as) { return as.reduceRight(function (b, a, i) { return f(i, a, b); }, b); }; };
exports.reduceRightWithIndex = reduceRightWithIndex;
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseWithIndexF = exports.traverseWithIndex(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
exports.traverse = traverse;
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence = function (F) { return exports.traverseWithIndex(F)(function_1.SK); };
exports.sequence = sequence;
/**
 * @category TraversableWithIndex
 * @since 2.6.3
 */
var traverseWithIndex = function (F) { return function (f) { return function (as) {
    var out = F.map(f(0, exports.head(as)), exports.of);
    for (var i = 1; i < as.length; i++) {
        out = F.ap(F.map(out, function (bs) { return function (b) { return function_1.pipe(bs, exports.append(b)); }; }), f(i, as[i]));
    }
    return out;
}; }; };
exports.traverseWithIndex = traverseWithIndex;
/**
 * @category Comonad
 * @since 2.6.3
 */
exports.extract = _.head;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.5.0
 */
exports.URI = 'ReadonlyNonEmptyArray';
/**
 * @category instances
 * @since 2.5.0
 */
var getShow = function (S) { return ({
    show: function (as) { return "[" + as.map(S.show).join(', ') + "]"; }
}); };
exports.getShow = getShow;
/**
 * Builds a `Semigroup` instance for `ReadonlyNonEmptyArray`
 *
 * @category instances
 * @since 2.5.0
 */
var getSemigroup = function () { return ({
    concat: concat
}); };
exports.getSemigroup = getSemigroup;
/**
 * @example
 * import { getEq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.5.0
 */
var getEq = function (E) {
    return Eq_1.fromEquals(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
exports.getEq = getEq;
/**
 * @category combinators
 * @since 2.11.0
 */
var getUnionSemigroup = function (E) {
    var unionE = exports.union(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
exports.getUnionSemigroup = getUnionSemigroup;
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
exports.FunctorWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex
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
 * @since 2.5.0
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
 * @since 2.5.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply_1.apSecond(exports.Apply);
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
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
exports.chainFirst = 
/*#__PURE__*/
Chain_1.chainFirst(exports.Chain);
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
 * @category instances
 * @since 2.7.0
 */
exports.FoldableWithIndex = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex
};
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
/**
 * @category instances
 * @since 2.7.0
 */
exports.TraversableWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex
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
 * @since 2.7.0
 */
exports.Comonad = {
    URI: exports.URI,
    map: _map,
    extend: _extend,
    extract: exports.extract
};
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
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
exports.head = exports.extract;
/**
 * @since 2.5.0
 */
exports.tail = _.tail;
/**
 * @since 2.5.0
 */
var last = function (as) { return as[as.length - 1]; };
exports.last = last;
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.5.0
 */
var init = function (as) { return as.slice(0, -1); };
exports.init = init;
/**
 * @since 2.5.0
 */
var min = function (O) {
    var S = Se.min(O);
    return function (as) { return as.reduce(S.concat); };
};
exports.min = min;
/**
 * @since 2.5.0
 */
var max = function (O) {
    var S = Se.max(O);
    return function (as) { return as.reduce(S.concat); };
};
exports.max = max;
/**
 * @since 2.10.0
 */
var concatAll = function (S) { return function (as) { return as.reduce(S.concat); }; };
exports.concatAll = concatAll;
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @category destructors
 * @since 2.11.0
 */
var matchLeft = function (f) { return function (as) {
    return f(exports.head(as), exports.tail(as));
}; };
exports.matchLeft = matchLeft;
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category destructors
 * @since 2.11.0
 */
var matchRight = function (f) { return function (as) {
    return f(exports.init(as), exports.last(as));
}; };
exports.matchRight = matchRight;
/**
 * Apply a function to the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyHead = function (f) { return function (as) { return __spreadArray([
    f(exports.head(as))
], exports.tail(as)); }; };
exports.modifyHead = modifyHead;
/**
 * Change the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.11.0
 */
var updateHead = function (a) { return exports.modifyHead(function () { return a; }); };
exports.updateHead = updateHead;
/**
 * Apply a function to the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyLast = function (f) { return function (as) {
    return function_1.pipe(exports.init(as), exports.append(f(exports.last(as))));
}; };
exports.modifyLast = modifyLast;
/**
 * Change the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.11.0
 */
var updateLast = function (a) { return exports.modifyLast(function () { return a; }); };
exports.updateLast = updateLast;
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`, then folds the results using the provided `Semigroup`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
var intercalate = function (S) {
    var concatAllS = exports.concatAll(S);
    return function (middle) { return function_1.flow(exports.intersperse(middle), concatAllS); };
};
exports.intercalate = intercalate;
function groupSort(O) {
    var sortO = exports.sort(O);
    var groupO = group(O);
    return function (as) { return (exports.isNonEmpty(as) ? groupO(sortO(as)) : exports.empty); };
}
exports.groupSort = groupSort;
function filter(predicate) {
    return exports.filterWithIndex(function (_, a) { return predicate(a); });
}
exports.filter = filter;
/**
 * Use [`filterWithIndex`](./ReadonlyArray.ts.html#filterwithindex) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var filterWithIndex = function (predicate) { return function (as) { return exports.fromReadonlyArray(as.filter(function (a, i) { return predicate(i, a); })); }; };
exports.filterWithIndex = filterWithIndex;
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category destructors
 * @since 2.10.0
 * @deprecated
 */
exports.uncons = exports.unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category destructors
 * @since 2.10.0
 * @deprecated
 */
exports.unsnoc = exports.unappend;
function cons(head, tail) {
    return tail === undefined ? exports.prepend(head) : function_1.pipe(tail, exports.prepend(head));
}
exports.cons = cons;
/**
 * Use [`append`](./ReadonlyArray.ts.html#append) instead.
 *
 * @category constructors
 * @since 2.5.0
 * @deprecated
 */
var snoc = function (init, end) { return function_1.pipe(init, concat([end])); };
exports.snoc = snoc;
/**
 * Use [`insertAt`](./ReadonlyArray.ts.html#insertat) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var insertAt = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? _.none : _.some(exports.unsafeInsertAt(i, a, as));
}; };
exports.insertAt = insertAt;
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
exports.prependToAll = exports.prependAll;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
exports.fold = exports.concatAll;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.5.0
 * @deprecated
 */
exports.readonlyNonEmptyArray = {
    URI: exports.URI,
    of: exports.of,
    map: _map,
    mapWithIndex: _mapWithIndex,
    ap: _ap,
    chain: _chain,
    extend: _extend,
    extract: exports.extract,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    alt: _alt
};
