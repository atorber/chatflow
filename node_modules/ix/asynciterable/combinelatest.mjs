import { AsyncIterableX } from './asynciterablex';
import { identity } from '../util/identity';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
import { safeRace } from '../util/safeRace';
// eslint-disable-next-line @typescript-eslint/no-empty-function
const NEVER_PROMISE = new Promise(() => { });
function wrapPromiseWithIndex(promise, index) {
    return promise.then((value) => ({ value, index }));
}
export class CombineLatestAsyncIterable extends AsyncIterableX {
    _sources;
    constructor(sources) {
        super();
        this._sources = sources;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const length = this._sources.length;
        const iterators = new Array(length);
        const nexts = new Array(length);
        let hasValueAll = false;
        const values = new Array(length);
        const hasValues = new Array(length);
        let active = length;
        hasValues.fill(false);
        for (let i = 0; i < length; i++) {
            const iterator = wrapWithAbort(this._sources[i], signal)[Symbol.asyncIterator]();
            iterators[i] = iterator;
            nexts[i] = wrapPromiseWithIndex(iterator.next(), i);
        }
        while (active > 0) {
            const next = safeRace(nexts);
            const { value: { value: value$, done: done$ }, index, } = await next;
            if (done$) {
                nexts[index] = NEVER_PROMISE;
                active--;
            }
            else {
                values[index] = value$;
                hasValues[index] = true;
                const iterator$ = iterators[index];
                nexts[index] = wrapPromiseWithIndex(iterator$.next(), index);
                if (hasValueAll || (hasValueAll = hasValues.every(identity))) {
                    yield values;
                }
            }
        }
    }
}
export function combineLatest(...sources) {
    return new CombineLatestAsyncIterable(sources);
}

//# sourceMappingURL=combinelatest.mjs.map
