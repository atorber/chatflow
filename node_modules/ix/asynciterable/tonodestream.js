"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNodeStreamProto = exports.toNodeStream = exports.AsyncIterableReadable = void 0;
const asynciterablex_1 = require("./asynciterablex");
const stream_1 = require("stream");
const done = async (_) => null;
class AsyncIterableReadable extends stream_1.Readable {
    _pulling = false;
    _objectMode = true;
    _iterator;
    constructor(source, options) {
        super(options);
        this._iterator = source[Symbol.asyncIterator]();
        this._objectMode = !options || !!options.objectMode;
    }
    _read(size) {
        const it = this._iterator;
        if (it && !this._pulling && (this._pulling = true)) {
            Promise.resolve(this._pull(it, size)).then((p) => (this._pulling = p));
        }
    }
    _destroy(err, cb) {
        const it = this._iterator;
        this._iterator = undefined;
        const fn = (it && (err ? it.throw : it.return)) || done;
        fn.call(it, err).then(() => cb && cb(null));
    }
    // eslint-disable-next-line complexity
    async _pull(it, size) {
        let innerSize = size;
        const objectMode = this._objectMode;
        let r;
        while (this.readable && !(r = await it.next(innerSize)).done) {
            if (innerSize != null) {
                if (objectMode) {
                    innerSize -= 1;
                }
                else {
                    innerSize -= Buffer.byteLength(r.value || '');
                }
            }
            if (!this.push(r.value) || innerSize <= 0) {
                break;
            }
        }
        if ((r && r.done) || !this.readable) {
            this.push(null);
            if (it.return) {
                await it.return();
            }
        }
        return !this.readable;
    }
}
exports.AsyncIterableReadable = AsyncIterableReadable;
function toNodeStream(source, options) {
    return !options || options.objectMode === true
        ? new AsyncIterableReadable(source, options)
        : new AsyncIterableReadable(source, options);
}
exports.toNodeStream = toNodeStream;
function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new AsyncIterableReadable(this, options)
        : new AsyncIterableReadable(this, options);
}
exports.toNodeStreamProto = toNodeStreamProto;
asynciterablex_1.AsyncIterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.js.map
