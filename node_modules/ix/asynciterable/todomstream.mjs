import { publish } from './operators/publish';
import { fromDOMStream } from './fromdomstream';
import { AsyncIterableX } from './asynciterablex';
/** @ignore */
function memcpy(target, source, targetByteOffset = 0, sourceByteLength = source.byteLength) {
    const targetByteLength = target.byteLength;
    const dst = new Uint8Array(target.buffer, target.byteOffset, targetByteLength);
    const src = new Uint8Array(source.buffer, source.byteOffset, Math.min(sourceByteLength, targetByteLength, source.buffer.byteLength - source.byteOffset));
    dst.set(src, targetByteOffset);
    return src.byteLength;
}
class AbstractUnderlyingSource {
    _source;
    constructor(_source) {
        this._source = _source;
    }
    async cancel() {
        const source = this._source;
        if (source && source.return) {
            await source.return();
        }
        this._source = null;
    }
}
class UnderlyingAsyncIterableDefaultSource extends AbstractUnderlyingSource {
    constructor(source) {
        super(source);
    }
    // eslint-disable-next-line consistent-return
    async pull(controller) {
        const source = this._source;
        if (source) {
            const r = await source.next(controller.desiredSize);
            if (!r.done) {
                return controller.enqueue(r.value);
            }
        }
        controller.close();
    }
}
class UnderlyingAsyncIterableByteSource extends AbstractUnderlyingSource {
    //   public readonly type: 'bytes';
    autoAllocateChunkSize;
    // If we can't create a "byob" reader (no browsers currently suppor it),
    // fallback to pulling values from the source iterator and enqueueing like
    // object streams
    fallbackDefaultSource;
    constructor(reader, opts = {}) {
        super(reader);
        this.type = 'bytes';
        this.autoAllocateChunkSize = opts['autoAllocateChunkSize'];
        this.fallbackDefaultSource = new UnderlyingAsyncIterableDefaultSource(reader);
    }
    // eslint-disable-next-line consistent-return
    async pull(controller) {
        if (!controller.byobRequest) {
            return await this.fallbackDefaultSource.pull(controller);
        }
        if (this._source) {
            const { view } = controller.byobRequest;
            const { done, value } = await this._source.next(view);
            if (!done) {
                // Did the source write into the BYOB view itself,
                // then yield us the `bytesWritten` value? If so,
                // pass that along
                if (typeof value === 'number') {
                    return controller.byobRequest.respond(value);
                }
                // otherwise if the source is only producing buffers
                // but doesn't expect to be given one, we should copy
                // the produced buffer into the front of the BYOB view
                if (ArrayBuffer.isView(value)) {
                    return value.buffer === view.buffer
                        ? controller.byobRequest.respondWithNewView(value)
                        : controller.byobRequest.respond(memcpy(view, value));
                }
            }
        }
        controller.close();
    }
}
// Generate subclasses of ReadableStream that conform to the
// AsyncIterable protocol. These classes are dynamically created
// the first time a ReadableStream is produced because ReadableStream
// is a browser-only API, and closure-compiler won't compile if they're
// statically defined at the module scope.
/** @ignore */
const asyncIterableReadableStream = (() => {
    let AsyncIterableReadableByteStream_;
    let AsyncIterableDefaultReadableStream_;
    // A function that's called the first time someone creates a
    // ReadableStream via `toDOMStream()`
    const createFirstTime = (source, opts) => {
        // Generate the subclasses with [Symbol.asyncIterator]() methods
        class AsyncIterableDefaultReadableStream extends ReadableStream {
            [Symbol.asyncIterator]() {
                return fromDOMStream(this)[Symbol.asyncIterator]();
            }
        }
        class AsyncIterableReadableByteStream extends ReadableStream {
            [Symbol.asyncIterator]() {
                return fromDOMStream(this, { mode: 'byob' })[Symbol.asyncIterator]();
            }
        }
        AsyncIterableReadableByteStream_ = AsyncIterableReadableByteStream;
        AsyncIterableDefaultReadableStream_ = AsyncIterableDefaultReadableStream;
        // Now point `createAsyncIterableReadableStream` to the function that
        // instantiates the classes we just created
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        createAsyncIterableReadableStream = createAsyncIterableReadableStreamEveryOtherTime;
        // Create and return the first ReadableStream<T> instance
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        return createAsyncIterableReadableStreamEveryOtherTime(source, opts);
    };
    // Shared function pointer that's called by the wrapper closure we return
    let createAsyncIterableReadableStream = createFirstTime;
    // Create instances of the classes generated by `createFirstTime`
    const createAsyncIterableReadableStreamEveryOtherTime = (source, opts) => {
        return source instanceof UnderlyingAsyncIterableByteSource
            ? new AsyncIterableReadableByteStream_(source, opts)
            : new AsyncIterableDefaultReadableStream_(source, opts);
    };
    return (source, opts) => createAsyncIterableReadableStream(source, opts);
})();
/**
 * Converts an async-iterable stream to a DOM stream.
 * @param source The async-iterable stream to convert to a DOM stream.
 * @param options The options to apply to the DOM stream.
 */
export function toDOMStream(source, options) {
    if (!options || !('type' in options) || options['type'] !== 'bytes') {
        return asyncIterableReadableStream(new UnderlyingAsyncIterableDefaultSource(source[Symbol.asyncIterator]()), options);
    }
    return asyncIterableReadableStream(new UnderlyingAsyncIterableByteSource(source[Symbol.asyncIterator](), options), options);
}
AsyncIterableX.prototype.tee = function () {
    return _getDOMStream(this).tee();
};
AsyncIterableX.prototype.pipeTo = function (writable, options) {
    return _getDOMStream(this).pipeTo(writable, options);
};
AsyncIterableX.prototype.pipeThrough = function (duplex, options) {
    return _getDOMStream(this).pipeThrough(duplex, options);
};
function _getDOMStream(self) {
    return self._DOMStream || (self._DOMStream = self.pipe(publish(), toDOMStream));
}
export function toDOMStreamProto(options) {
    return !options ? toDOMStream(this) : toDOMStream(this, options);
}
AsyncIterableX.prototype.toDOMStream = toDOMStreamProto;

//# sourceMappingURL=todomstream.mjs.map
