export declare function extremaBy<TSource, TKey>(source: Iterable<TSource>, selector: (item: TSource) => TKey, comparer: (left: TKey, right: TKey) => number): TSource[];
