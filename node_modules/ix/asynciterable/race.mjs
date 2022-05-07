import { AsyncIterableX } from './asynciterablex';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
import { safeRace } from '../util/safeRace';
function wrapPromiseWithIndex(promise, index) {
    return promise.then((value) => ({ value, index }));
}
export class RaceAsyncIterable extends AsyncIterableX {
    _sources;
    constructor(sources) {
        super();
        this._sources = sources;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const sources = this._sources;
        const length = sources.length;
        const iterators = new Array(length);
        const nexts = new Array(length);
        for (let i = 0; i < length; i++) {
            const iterator = wrapWithAbort(sources[i], signal)[Symbol.asyncIterator]();
            iterators[i] = iterator;
            nexts[i] = wrapPromiseWithIndex(iterator.next(), i);
        }
        const next = safeRace(nexts);
        const { value: next$, index } = await next;
        if (!next$.done) {
            yield next$.value;
        }
        const iterator$ = iterators[index];
        // Cancel/finish other iterators
        for (let i = 0; i < length; i++) {
            if (i === index) {
                continue;
            }
            const otherIterator = iterators[i];
            if (otherIterator.return) {
                otherIterator.return();
            }
        }
        let nextItem;
        while (!(nextItem = await iterator$.next()).done) {
            yield nextItem.value;
        }
    }
}
/**
 * Propagates the async sequence that reacts first.
 *
 * @param {...AsyncIterable<T>[]} sources The source sequences.
 * @return {AsyncIterable<T>} An async sequence that surfaces either of the given sequences, whichever reacted first.
 */
export function race(...sources) {
    return new RaceAsyncIterable(sources);
}

//# sourceMappingURL=race.mjs.map
