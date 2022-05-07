import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class MapIterable<TSource, TResult> extends IterableX<TResult> {
    private _source;
    private _selector;
    constructor(source: Iterable<TSource>, selector: (value: TSource, index: number) => TResult);
    [Symbol.iterator](): Generator<TResult, void, unknown>;
}
/**
 * Projects each element of an async-enumerable sequence into a new form.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the result sequence, obtained by running the selector
 * function for each element in the source sequence.
 * @param {((value: TSource, index: number) => TResult)} selector A transform function
 * to apply to each source element.
 * @param {*} [thisArg] Optional this for binding to the selector.
 * @returns {OperatorFunction<TSource, TResult>} An iterable sequence whose elements are the result of invoking the transform
 * function on each element of source.
 */
export declare function map<TSource, TResult>(selector: (value: TSource, index: number) => TResult, thisArg?: any): OperatorFunction<TSource, TResult>;
