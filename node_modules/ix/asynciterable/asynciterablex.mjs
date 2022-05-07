import { as as asAsyncIterable } from './as';
import { _initialize as _initializeFrom } from './from';
import { isReadableNodeStream, isWritableNodeStream } from '../util/isiterable';
class WithAbortAsyncIterable {
    _source;
    _signal;
    constructor(source, signal) {
        this._source = source;
        this._signal = signal;
    }
    [Symbol.asyncIterator]() {
        // @ts-ignore
        return this._source[Symbol.asyncIterator](this._signal);
    }
}
/**
 * This class serves as the base for all operations which support [Symbol.asyncIterator].
 */
export class AsyncIterableX {
    async forEach(projection, thisArg, signal) {
        const source = signal ? new WithAbortAsyncIterable(this, signal) : this;
        let i = 0;
        for await (const item of source) {
            await projection.call(thisArg, item, i++, signal);
        }
    }
    pipe(...args) {
        let i = -1;
        const n = args.length;
        let acc = this;
        while (++i < n) {
            acc = args[i](asAsyncIterable(acc));
        }
        return acc;
    }
}
AsyncIterableX.prototype[Symbol.toStringTag] = 'AsyncIterableX';
Object.defineProperty(AsyncIterableX, Symbol.hasInstance, {
    writable: true,
    configurable: true,
    value(inst) {
        return !!(inst && inst[Symbol.toStringTag] === 'AsyncIterableX');
    },
});
_initializeFrom(AsyncIterableX);
try {
    ((isBrowser) => {
        if (isBrowser) {
            return;
        }
        AsyncIterableX.prototype['pipe'] = nodePipe;
        const readableOpts = (x, opts = x._writableState || { objectMode: true }) => opts;
        function nodePipe(...args) {
            let i = -1;
            let end;
            const n = args.length;
            let prev = this;
            let next;
            while (++i < n) {
                next = args[i];
                if (typeof next === 'function') {
                    prev = next(asAsyncIterable(prev));
                }
                else if (isWritableNodeStream(next)) {
                    ({ end = true } = args[i + 1] || {});
                    // prettier-ignore
                    return isReadableNodeStream(prev) ? prev.pipe(next, { end }) :
                        asAsyncIterable(prev).toNodeStream(readableOpts(next)).pipe(next, { end });
                }
            }
            return prev;
        }
    })(typeof window === 'object' && typeof document === 'object' && document.nodeType === 9);
}
catch (e) {
    /* */
}

//# sourceMappingURL=asynciterablex.mjs.map
