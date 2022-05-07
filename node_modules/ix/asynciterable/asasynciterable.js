"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asAsyncIterable = exports.AsyncIterableTransform = void 0;
const asynciterablex_1 = require("./asynciterablex");
const stream_1 = require("stream");
const asyncIterableMixin = Symbol('asyncIterableMixin');
class AsyncIterableTransform extends stream_1.Transform {
    static [asyncIterableMixin] = false;
    constructor(options) {
        super(options);
        // If this is the first time AsyncIterableTransform is being constructed,
        // mixin the methods from the AsyncIterableX's prototype.
        if (!AsyncIterableTransform[asyncIterableMixin]) {
            AsyncIterableTransform[asyncIterableMixin] = true;
            Object.defineProperties(AsyncIterableTransform.prototype, Object.getOwnPropertyDescriptors(asynciterablex_1.AsyncIterableX.prototype));
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
exports.AsyncIterableTransform = AsyncIterableTransform;
function asAsyncIterable(options = {}) {
    return new AsyncIterableTransform(options);
}
exports.asAsyncIterable = asAsyncIterable;

//# sourceMappingURL=asasynciterable.js.map
