import { AsyncSink } from './asyncsink';
import { memoize } from './operators/memoize';
/**
 * Creates asnyc-iterable from an event emitter by adding handlers for both listening and unsubscribing from events.
 *
 * @template TSource The type of elements in the event emitter.
 * @param {(handler: (...args: any[]) => void) => void} addHandler The function to add a listener to the source.
 * @param {(handler: (...args: any[]) => void) => void} removeHandler The function to remove a listener from the source.
 * @returns {AsyncIterableX<TSource>} An async-iterable which contains the data from the underlying events as wrapped by the handlers.
 */
export function fromEventPattern(addHandler, removeHandler) {
    const sink = new AsyncSink();
    const handler = (e) => sink.write(e);
    addHandler(handler);
    const yielder = async function* () {
        for (let next; !(next = await sink.next()).done;) {
            yield next.value;
        }
        removeHandler(handler);
        sink.end();
    };
    return memoize()(yielder());
}

//# sourceMappingURL=fromeventpattern.mjs.map
