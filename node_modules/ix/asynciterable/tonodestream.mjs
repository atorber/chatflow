import { AsyncIterableX } from './asynciterablex';
import { Readable } from 'stream';
const done = async (_) => null;
export class AsyncIterableReadable extends Readable {
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
export function toNodeStream(source, options) {
    return !options || options.objectMode === true
        ? new AsyncIterableReadable(source, options)
        : new AsyncIterableReadable(source, options);
}
export function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new AsyncIterableReadable(this, options)
        : new AsyncIterableReadable(this, options);
}
AsyncIterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.mjs.map
