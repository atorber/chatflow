"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNodeStreamProto = exports.toNodeStream = exports.IterableReadable = void 0;
const iterablex_1 = require("../iterable/iterablex");
const stream_1 = require("stream");
const done = (_) => null;
class IterableReadable extends stream_1.Readable {
    _pulling = false;
    _objectMode = true;
    _iterator;
    constructor(source, options) {
        super(options);
        this._iterator = source[Symbol.iterator]();
        this._objectMode = !options || !!options.objectMode;
    }
    _read(size) {
        const it = this._iterator;
        if (it && !this._pulling && (this._pulling = true)) {
            this._pulling = this._pull(it, size);
        }
    }
    _destroy(err, cb) {
        const it = this._iterator;
        this._iterator = undefined;
        const fn = (it && (err ? it.throw : it.return)) || done;
        fn.call(it, err);
        if (cb) {
            cb(null);
        }
    }
    // eslint-disable-next-line complexity
    _pull(it, size) {
        let innerSize = size;
        const objectMode = this._objectMode;
        let r;
        while (this.readable && !(r = it.next(innerSize)).done) {
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
                it.return();
            }
        }
        return !this.readable;
    }
}
exports.IterableReadable = IterableReadable;
function toNodeStream(source, options) {
    return !options || options.objectMode === true
        ? new IterableReadable(source, options)
        : new IterableReadable(source, options);
}
exports.toNodeStream = toNodeStream;
function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new IterableReadable(this, options)
        : new IterableReadable(this, options);
}
exports.toNodeStreamProto = toNodeStreamProto;
iterablex_1.IterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.js.map
