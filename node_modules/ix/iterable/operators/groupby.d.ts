import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class GroupedIterable<TKey, TValue> extends IterableX<TValue> {
    readonly key: TKey;
    private _source;
    constructor(key: TKey, source: Iterable<TValue>);
    [Symbol.iterator](): Generator<TValue, void, unknown>;
}
export declare class GroupByIterable<TSource, TKey, TValue> extends IterableX<GroupedIterable<TKey, TValue>> {
    private _source;
    private _keySelector;
    private _elementSelector;
    constructor(source: Iterable<TSource>, keySelector: (value: TSource) => TKey, elementSelector: (value: TSource) => TValue);
    [Symbol.iterator](): Generator<GroupedIterable<TKey, TValue>, void, unknown>;
}
export declare function groupBy<TSource, TKey>(keySelector: (value: TSource) => TKey): OperatorFunction<TSource, GroupedIterable<TKey, TSource>>;
export declare function groupBy<TSource, TKey, TValue>(keySelector: (value: TSource) => TKey, elementSelector?: (value: TSource) => TValue): OperatorFunction<TSource, GroupedIterable<TKey, TValue>>;
