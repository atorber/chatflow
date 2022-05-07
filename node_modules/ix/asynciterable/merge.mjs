import { AsyncIterableX } from './asynciterablex';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
import { safeRace } from '../util/safeRace';
// eslint-disable-next-line @typescript-eslint/no-empty-function
const NEVER_PROMISE = new Promise(() => { });
function wrapPromiseWithIndex(promise, index) {
    return promise.then((value) => ({ value, index }));
}
export class MergeAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const length = this._source.length;
        const iterators = new Array(length);
        const nexts = new Array(length);
        let active = length;
        for (let i = 0; i < length; i++) {
            const iterator = wrapWithAbort(this._source[i], signal)[Symbol.asyncIterator]();
            iterators[i] = iterator;
            nexts[i] = wrapPromiseWithIndex(iterator.next(), i);
        }
        while (active > 0) {
            const next = safeRace(nexts);
            const { value: { done: done$, value: value$ }, index, } = await next;
            if (done$) {
                nexts[index] = NEVER_PROMISE;
                active--;
            }
            else {
                const iterator$ = iterators[index];
                nexts[index] = wrapPromiseWithIndex(iterator$.next(), index);
                yield value$;
            }
        }
    }
}
export function merge(source, ...args) {
    return new MergeAsyncIterable([source, ...args]);
}

//# sourceMappingURL=merge.mjs.map
