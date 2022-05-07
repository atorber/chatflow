import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class FilterIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _predicate;
    private _thisArg?;
    constructor(source: Iterable<TSource>, predicate: (value: TSource, index: number) => boolean, thisArg?: any);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
export declare function filter<T, S extends T>(predicate: (value: T, index: number) => value is S, thisArg?: any): OperatorFunction<T, S>;
export declare function filter<T>(predicate: (value: T, index: number) => boolean, thisArg?: any): OperatorFunction<T, T>;
