import { IterableX } from '../iterablex';
import { sorter as defaultSorter } from '../../util/sorter';
export class OrderedIterableBaseX extends IterableX {
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
    thenBy(keySelector, comparer = defaultSorter) {
        return new OrderedIterableX(this._source, keySelector, comparer, false, this);
    }
    thenByDescending(keySelector, comparer = defaultSorter) {
        return new OrderedIterableX(this._source, keySelector, comparer, true, this);
    }
}
export class OrderedIterableX extends OrderedIterableBaseX {
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
export function orderBy(keySelector, comparer = defaultSorter) {
    return function orderByOperatorFunction(source) {
        return new OrderedIterableX(source, keySelector, comparer, false);
    };
}
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
export function orderByDescending(keySelector, comparer = defaultSorter) {
    return function orderByDescendingOperatorFunction(source) {
        return new OrderedIterableX(source, keySelector, comparer, true);
    };
}
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
export function thenBy(keySelector, comparer = defaultSorter) {
    return function thenByOperatorFunction(source) {
        const orderSource = source;
        return new OrderedIterableX(orderSource._source, keySelector, comparer, false, orderSource);
    };
}
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
export function thenByDescending(keySelector, comparer = defaultSorter) {
    return function thenByDescendingOperatorFunction(source) {
        const orderSource = source;
        return new OrderedIterableX(orderSource._source, keySelector, comparer, true, orderSource);
    };
}

//# sourceMappingURL=orderby.mjs.map
