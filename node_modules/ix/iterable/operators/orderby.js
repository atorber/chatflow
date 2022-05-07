"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thenByDescending = exports.thenBy = exports.orderByDescending = exports.orderBy = exports.OrderedIterableX = exports.OrderedIterableBaseX = void 0;
const iterablex_1 = require("../iterablex");
const sorter_1 = require("../../util/sorter");
class OrderedIterableBaseX extends iterablex_1.IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        const array = Array.from(this._source);
        const len = array.length;
        const indices = new Array(len);
        for (let i = 0; i < len; i++) {
            indices[i] = i;
        }
        indices.sort(this._getSorter(array));
        for (const index of indices) {
            yield array[index];
        }
    }
    thenBy(keySelector, comparer = sorter_1.sorter) {
        return new OrderedIterableX(this._source, keySelector, comparer, false, this);
    }
    thenByDescending(keySelector, comparer = sorter_1.sorter) {
        return new OrderedIterableX(this._source, keySelector, comparer, true, this);
    }
}
exports.OrderedIterableBaseX = OrderedIterableBaseX;
class OrderedIterableX extends OrderedIterableBaseX {
    _keySelector;
    _comparer;
    _descending;
    _parent;
    constructor(source, keySelector, comparer, descending, parent) {
        super(source);
        this._keySelector = keySelector;
        this._comparer = comparer;
        this._descending = descending;
        this._parent = parent;
    }
    _getSorter(elements, next) {
        const keys = elements.map(this._keySelector);
        const comparer = this._comparer;
        const parent = this._parent;
        const descending = this._descending;
        const sorter = (x, y) => {
            const result = comparer(keys[x], keys[y]);
            if (result === 0) {
                return next ? next(x, y) : x - y;
            }
            return descending ? -result : result;
        };
        return parent ? parent._getSorter(elements, sorter) : sorter;
    }
}
exports.OrderedIterableX = OrderedIterableX;
/**
 * Sorts the elements of a sequence in ascending order according to a key by using a specified comparer.
 *
 * @template TKey The type of the elements of source.
 * @template TSource The type of the key returned by keySelector.
 * @param {(item: TSource) => TKey} keySelector A function to extract a key from an element.
 * @param {(fst: TKey, snd: TKey) => number} [comparer=defaultSorter] A comparer to compare keys.
 * @returns {UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>} An ordered iterable sequence whose
 * elements are sorted according to a key and comparer.
 */
function orderBy(keySelector, comparer = sorter_1.sorter) {
    return function orderByOperatorFunction(source) {
        return new OrderedIterableX(source, keySelector, comparer, false);
    };
}
exports.orderBy = orderBy;
/**
 * Sorts the elements of a sequence in descending order according to a key by using a specified comparer.
 *
 * @template TKey The type of the elements of source.
 * @template TSource The type of the key returned by keySelector.
 * @param {(item: TSource) => TKey} keySelector A function to extract a key from an element.
 * @param {(fst: TKey, snd: TKey) => number} [comparer=defaultSorter] A comparer to compare keys.
 * @returns {UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>} An ordered iterable sequence whose
 * elements are sorted in descending order according to a key and comparer.
 */
function orderByDescending(keySelector, comparer = sorter_1.sorter) {
    return function orderByDescendingOperatorFunction(source) {
        return new OrderedIterableX(source, keySelector, comparer, true);
    };
}
exports.orderByDescending = orderByDescending;
/**
 * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key using a specified comparer.
 *
 * @template TKey The type of the elements of source.
 * @template TSource The type of the key returned by keySelector.
 * @param {(item: TSource) => TKey} keySelector A function to extract a key from an element.
 * @param {(fst: TKey, snd: TKey) => number} [comparer=defaultSorter] A comparer to compare keys.
 * @returns {UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>} An ordered iterable whose elements are
 * sorted according to a key and comparer.
 */
function thenBy(keySelector, comparer = sorter_1.sorter) {
    return function thenByOperatorFunction(source) {
        const orderSource = source;
        return new OrderedIterableX(orderSource._source, keySelector, comparer, false, orderSource);
    };
}
exports.thenBy = thenBy;
/**
 * Performs a subsequent ordering of the elements in a sequence in descending order according to a key using a specified comparer.
 *
 * @template TKey The type of the elements of source.
 * @template TSource The type of the key returned by keySelector.
 * @param {(item: TSource) => TKey} keySelector A function to extract a key from an element.
 * @param {(fst: TKey, snd: TKey) => number} [comparer=defaultSorter] A comparer to compare keys.
 * @returns {UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>} An ordered iterable whose elements are
 * sorted in descending order according to a key and comparer.
 */
function thenByDescending(keySelector, comparer = sorter_1.sorter) {
    return function thenByDescendingOperatorFunction(source) {
        const orderSource = source;
        return new OrderedIterableX(orderSource._source, keySelector, comparer, true, orderSource);
    };
}
exports.thenByDescending = thenByDescending;

//# sourceMappingURL=orderby.js.map
