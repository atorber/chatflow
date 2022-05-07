import { AsyncIterableX } from './asynciterablex';
export interface NodeEventEmitter {
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}
export declare type EventListenerOptions = {
    capture?: boolean;
    passive?: boolean;
    once?: boolean;
} | boolean;
export declare type EventedTarget = EventTarget | NodeEventEmitter;
/**
 * Converts an event emitter event into an async-iterable stream.
 *
 * @template TSource The type of elements in the emitter stream.
 * @param {EventedTarget} obj The object that emits the events to turn into an async-iterable.
 * @param {string} type The name of the event to listen for creation of the async-iterable.
 * @param {EventListenerOptions} [options] The options for listening to the events such as capture, passive and once.
 * @returns {AsyncIterableX<TSource>} An async-iterable sequence created from the events emitted from the evented target.
 */
export declare function fromEvent<TSource>(obj: EventedTarget, type: string, options?: EventListenerOptions): AsyncIterableX<TSource>;
