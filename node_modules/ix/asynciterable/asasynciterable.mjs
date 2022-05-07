import { AsyncIterableX } from './asynciterablex';
import { Transform } from 'stream';
const asyncIterableMixin = Symbol('asyncIterableMixin');
export class AsyncIterableTransform extends Transform {
    static [asyncIterableMixin] = false;
    constructor(options) {
        super(options);
        // If this is the first time AsyncIterableTransform is being constructed,
        // mixin the methods from the AsyncIterableX's prototype.
        if (!AsyncIterableTransform[asyncIterableMixin]) {
            AsyncIterableTransform[asyncIterableMixin] = true;
            Object.defineProperties(AsyncIterableTransform.prototype, Object.getOwnPropertyDescriptors(AsyncIterableX.prototype));
        }
    }
    /** @nocollapse */
    _flush(callback) {
        callback();
    }
    /** @nocollapse */
    _transform(chunk, _encoding, callback) {
        callback(null, chunk);
    }
}
export function asAsyncIterable(options = {}) {
    return new AsyncIterableTransform(options);
}

//# sourceMappingURL=asasynciterable.mjs.map
