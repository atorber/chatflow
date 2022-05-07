import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class TakeWhileIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _predicate;
    constructor(source: Iterable<TSource>, predicate: (value: TSource, index: number) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Returns elements from an iterable sequence as long as a specified condition is true.
 *
 * @template T The type of the elements in the source sequence.
 * @template S The result of the predicate that is truthy/falsy.
 * @param {(value: T, index: number) => value is S} predicate A function to test each element for a condition.
 * @returns {OperatorFunction<T, S>} An iterable sequence that contains the elements from the input sequence that occur
 * before the element at which the test no longer passes.
 */
export declare function takeWhile<T, S extends T>(predicate: (value: T, index: number) => value is S): OperatorFunction<T, S>;
/**
 * Returns elements from an iterable sequence as long as a specified condition is true.
 *
 * @template T The type of the elements in the source sequence.
 * @param {((value: T, index: number) => boolean)} predicate A function to test each element for a condition.
 * @returns {OperatorFunction<T, T>} An iterable sequence that contains the elements from the input sequence that occur
 * before the element at which the test no longer passes.
 */
export declare function takeWhile<T>(predicate: (value: T, index: number) => boolean): OperatorFunction<T, T>;
