import { as as asIterable } from './as';
import { _initialize as _initializeFrom } from './from';
import { bindCallback } from '../util/bindcallback';
import { isReadableNodeStream, isWritableNodeStream } from '../util/isiterable';
/**
 * This class serves as the base for all operations which support [Symbol.iterator].
 */
export class IterableX {
    forEach(projection, thisArg) {
        const fn = bindCallback(projection, thisArg, 2);
        let i = 0;
        for (const item of this) {
            fn(item, i++);
        }
    }
    pipe(...args) {
        let i = -1;
        const n = args.length;
        let acc = this;
        while (++i < n) {
            acc = args[i](asIterable(acc));
        }
        return acc;
    }
}
IterableX.prototype[Symbol.toStringTag] = 'IterableX';
Object.defineProperty(IterableX, Symbol.hasInstance, {
    writable: true,
    configurable: true,
    value(inst) {
        return !!(inst && inst[Symbol.toStringTag] === 'IterableX');
    },
});
_initializeFrom(IterableX);
try {
    ((isBrowser) => {
        if (isBrowser) {
            return;
        }
        IterableX.prototype['pipe'] = nodePipe;
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
                    prev = next(asIterable(prev));
                }
                else if (isWritableNodeStream(next)) {
                    ({ end = true } = args[i + 1] || {});
                    // prettier-ignore
                    return isReadableNodeStream(prev) ? prev.pipe(next, { end }) :
                        asIterable(prev).toNodeStream(readableOpts(next)).pipe(next, { end });
                }
            }
            return prev;
        }
    })(typeof window === 'object' && typeof document === 'object' && document.nodeType === 9);
}
catch (e) {
    /* */
}

//# sourceMappingURL=iterablex.mjs.map
