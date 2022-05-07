import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class FinallyIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _action;
    constructor(source: Iterable<TSource>, action: () => void);
    [Symbol.iterator](): Generator<TSource, void, undefined>;
}
/**
 *  Invokes a specified asynchronous action after the source iterable sequence terminates gracefully or exceptionally.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {(() => void)} action Action to invoke and await asynchronously after the source iterable sequence terminates
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns the source sequence with the
 * action-invoking termination behavior applied.
 */
export declare function finalize<TSource>(action: () => void): MonoTypeOperatorFunction<TSource>;
