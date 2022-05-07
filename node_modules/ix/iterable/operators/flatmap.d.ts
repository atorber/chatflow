import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class FlatMapIterable<TSource, TResult> extends IterableX<TResult> {
    private _source;
    private _fn;
    private _thisArg?;
    constructor(source: Iterable<TSource>, fn: (value: TSource) => Iterable<TResult>, thisArg?: any);
    [Symbol.iterator](): Generator<TResult, void, unknown>;
}
/**
 * Projects each element of an iterable sequence to an iterable sequence and merges
 * the resulting iterable sequences into one iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the projected inner sequences and the elements in the merged result sequence.
 * @param {((value: TSource, index: number) => Iterable<TResult>)} selector A transform function to apply to each element.
 * @param {*} [thisArg] Option this for binding to the selector.
 * @returns {OperatorFunction<TSource, TResult>} An operator that creates an iterable sequence whose
 * elements are the result of invoking the one-to-many transform function on each element of the input sequence.
 */
export declare function flatMap<TSource, TResult>(selector: (value: TSource) => Iterable<TResult>, thisArg?: any): OperatorFunction<TSource, TResult>;
