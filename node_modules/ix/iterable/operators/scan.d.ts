import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
import { ScanOptions } from './scanoptions';
export declare class ScanIterable<T, R> extends IterableX<R> {
    private _source;
    private _fn;
    private _seed?;
    private _hasSeed;
    constructor(source: Iterable<T>, options: ScanOptions<T, R>);
    [Symbol.iterator](): Generator<R, void, unknown>;
}
/**
 * Applies an accumulator function over an iterable sequence and returns each intermediate result.
 * The specified seed value, if given, is used as the initial accumulator value.
 *
 * @template T The type of the elements in the source sequence.
 * @template R The type of the result of the aggregation.
 * @param {ScanOptions<T, R>} options The options including the accumulator function and seed.
 * @returns {OperatorFunction<T, R>} An async-enumerable sequence containing the accumulated values.
 */
export declare function scan<T, R = T>(options: ScanOptions<T, R>): OperatorFunction<T, R>;
export declare function scan<T, R = T>(accumulator: (accumulator: R, current: T, index: number) => R, seed?: R): OperatorFunction<T, R>;
