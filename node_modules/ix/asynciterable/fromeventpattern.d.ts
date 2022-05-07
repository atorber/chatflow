import { AsyncIterableX } from './asynciterablex';
/**
 * Creates asnyc-iterable from an event emitter by adding handlers for both listening and unsubscribing from events.
 *
 * @template TSource The type of elements in the event emitter.
 * @param {(handler: (...args: any[]) => void) => void} addHandler The function to add a listener to the source.
 * @param {(handler: (...args: any[]) => void) => void} removeHandler The function to remove a listener from the source.
 * @returns {AsyncIterableX<TSource>} An async-iterable which contains the data from the underlying events as wrapped by the handlers.
 */
export declare function fromEventPattern<TSource>(addHandler: (handler: (...args: any[]) => void) => void, removeHandler: (handler: (...args: any[]) => void) => void): AsyncIterableX<TSource>;
