/**
 * @ignore
 */
export declare function createGrouping<TSource, TKey, TValue>(source: AsyncIterable<TSource>, keySelector: (value: TSource, signal?: AbortSignal) => TKey | Promise<TKey>, elementSelector: (value: TSource, signal?: AbortSignal) => TValue | Promise<TValue>, signal?: AbortSignal): Promise<Map<TKey, TValue[]>>;
