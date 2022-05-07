/**
 * @ignore
 */
export declare function createGrouping<TSource, TKey, TValue>(source: Iterable<TSource>, keySelector: (value: TSource) => TKey, elementSelector: (value: TSource) => TValue): Map<TKey, TValue[]>;
