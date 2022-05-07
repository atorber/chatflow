import { IterableX } from '../iterablex';
import { PartialObserver } from '../../observer';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class TapIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _observer;
    constructor(source: Iterable<TSource>, observer: PartialObserver<TSource>);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Invokes an action for each element in the iterable sequence, and propagates all observer
 * messages through the result sequence. This method can be used for debugging, logging, etc. by
 * intercepting the message stream to run arbitrary actions for messages on the pipeline.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {PartialObserver<TSource>} observer Observer whose methods to invoke as part of the source sequence's observation.
 * @returns {MonoTypeOperatorFunction<TSource>} The source sequence with the side-effecting behavior applied.
 */
export declare function tap<TSource>(observer: PartialObserver<TSource>): MonoTypeOperatorFunction<TSource>;
/**
 * Invokes an action for each element in the iterable sequence, and propagates all observer
 * messages through the result sequence. This method can be used for debugging, logging, etc. by
 * intercepting the message stream to run arbitrary actions for messages on the pipeline.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {(((value: TSource) => any) | null)} [next] Function to invoke for each element in the iterable sequence.
 * @param {(((err: any) => any) | null)} [error] Function to invoke upon exceptional termination of the iterable sequence.
 * @param {((() => any) | null)} [complete] Function to invoke upon graceful termination of the iterable sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} The source sequence with the side-effecting behavior applied.
 */
export declare function tap<TSource>(next?: ((value: TSource) => any) | null, error?: ((err: any) => any) | null, complete?: (() => any) | null): MonoTypeOperatorFunction<TSource>;
