import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
import { identity } from '../../util/identity';
import { safeRace } from '../../util/safeRace';
// eslint-disable-next-line @typescript-eslint/no-empty-function
const NEVER_PROMISE = new Promise(() => { });
function wrapPromiseWithIndex(promise, index) {
    return promise.then((value) => ({ value, index }));
}
export class WithLatestFromAsyncIterable extends AsyncIterableX {
    _source;
    _others;
    constructor(source, others) {
        super();
        this._source = source;
        this._others = others;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const length = this._others.length;
        const newLength = length + 1;
        const iterators = new Array(newLength);
        const nexts = new Array(newLength);
        let hasValueAll = false;
        const hasValue = new Array(length);
        const values = new Array(length);
        hasValue.fill(false);
        for (let i = 0; i < length; i++) {
            const iterator = wrapWithAbort(this._others[i], signal)[Symbol.asyncIterator]();
            iterators[i] = iterator;
            nexts[i] = wrapPromiseWithIndex(iterator.next(), i);
        }
        const it = wrapWithAbort(this._source, signal)[Symbol.asyncIterator]();
        iterators[length] = it;
        nexts[length] = wrapPromiseWithIndex(it.next(), length);
        for (;;) {
            const next = safeRace(nexts);
            const { value: { value: value$, done: done$ }, index, } = await next;
            if (index === length) {
                if (done$) {
                    break;
                }
                const iterator$ = iterators[index];
                nexts[index] = wrapPromiseWithIndex(iterator$.next(), index);
                if (hasValueAll) {
                    yield [value$, ...values];
                }
            }
            else if (done$) {
                nexts[index] = NEVER_PROMISE;
            }
            else {
                values[index] = value$;
                hasValue[index] = true;
                hasValueAll = hasValue.every(identity);
                const iterator$ = iterators[index];
                nexts[index] = wrapPromiseWithIndex(iterator$.next(), index);
            }
        }
    }
}
export function withLatestFrom(...sources) {
    return function withLatestFromOperatorFunction(source) {
        return new WithLatestFromAsyncIterable(source, sources);
    };
}

//# sourceMappingURL=withlatestfrom.mjs.map
