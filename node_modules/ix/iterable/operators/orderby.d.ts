import { IterableX } from '../iterablex';
import { UnaryFunction } from '../../interfaces';
export declare abstract class OrderedIterableBaseX<TSource> extends IterableX<TSource> {
    _source: Iterable<TSource>;
    constructor(source: Iterable<TSource>);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
    thenBy<TKey>(keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): OrderedIterableBaseX<TSource>;
    thenByDescending<TKey>(keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): OrderedIterableBaseX<TSource>;
    abstract _getSorter(elements: TSource[], next?: (x: number, y: number) => number): (x: number, y: number) => number;
}
export declare class OrderedIterableX<TKey, TSource> extends OrderedIterableBaseX<TSource> {
    private _keySelector;
    private _comparer;
    private _descending;
    private _parent?;
    constructor(source: Iterable<TSource>, keySelector: (item: TSource) => TKey, comparer: (fst: TKey, snd: TKey) => number, descending: boolean, parent?: OrderedIterableBaseX<TSource>);
    _getSorter(elements: TSource[], next?: (x: number, y: number) => number): (x: number, y: number) => number;
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
export declare function orderBy<TKey, TSource>(keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>;
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
export declare function orderByDescending<TKey, TSource>(keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>;
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
export declare function thenBy<TKey, TSource>(keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>;
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
export declare function thenByDescending<TKey, TSource>(keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): UnaryFunction<Iterable<TSource>, OrderedIterableX<TKey, TSource>>;
