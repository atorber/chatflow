import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class SkipWhileIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _predicate;
    constructor(source: Iterable<TSource>, predicate: (value: TSource, index: number) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Bypasses elements in an async-iterale sequence as long as a specified condition is true
 * and then returns the remaining elements.
 *
 * @template T The type of the elements in the source sequence.
 * @template S The result of the predicate that is truthy/falsy.
 * @param {(value: T, index: number) => value is S} predicate A function to test each element for a condition.
 * @returns {OperatorFunction<T, S>} An iterable sequence that contains the elements from the input
 * sequence starting at the first element in the linear series that does not pass the test specified by predicate.
 */
export declare function skipWhile<T, S extends T>(predicate: (value: T, index: number) => value is S): OperatorFunction<T, S>;
/**
 * Bypasses elements in an async-iterale sequence as long as a specified condition is true
 * and then returns the remaining elements.
 *
 * @template T The type of the elements in the source sequence.
 * @param {((value: T, index: number) => boolean)} predicate A function to test each element for a condition.
 * @returns {OperatorFunction<T, T>} An iterable sequence that contains the elements from the input
 * sequence starting at the first element in the linear series that does not pass the test specified by predicate.
 */
export declare function skipWhile<T>(predicate: (value: T, index: number) => boolean): OperatorFunction<T, T>;
