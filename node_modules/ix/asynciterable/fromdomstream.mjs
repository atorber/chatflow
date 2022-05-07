import { AsyncIterableX } from './asynciterablex';
/** @ignore */
const SharedArrayBuf = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : ArrayBuffer;
export class AsyncIterableReadableStream extends AsyncIterableX {
    _stream;
    constructor(_stream) {
        super();
        this._stream = _stream;
    }
    [Symbol.asyncIterator]() {
        const stream = this._stream;
        const reader = stream['getReader']();
        return _consumeReader(stream, reader, defaultReaderToAsyncIterator(reader));
    }
}
export class AsyncIterableReadableByteStream extends AsyncIterableReadableStream {
    [Symbol.asyncIterator]() {
        const stream = this._stream;
        let reader;
        try {
            reader = stream['getReader']({ mode: 'byob' });
        }
        catch (e) {
            return super[Symbol.asyncIterator]();
        }
        const iterator = _consumeReader(stream, reader, byobReaderToAsyncIterator(reader));
        // "pump" the iterator once so it initializes and is ready to accept a buffer or bytesToRead
        iterator.next();
        return iterator;
    }
}
async function* _consumeReader(stream, reader, iterator) {
    let threw = false;
    try {
        yield* iterator;
    }
    catch (e) {
        if ((threw = true) && reader) {
            await reader['cancel'](e);
        }
    }
    finally {
        if (reader) {
            if (!threw) {
                await reader['cancel']();
            }
            if (stream.locked) {
                try {
                    reader.closed.catch(() => {
                        /* */
                    });
                    reader.releaseLock();
                }
                catch (e) {
                    /* */
                }
            }
        }
    }
}
/** @ignore */
async function* defaultReaderToAsyncIterator(reader) {
    let r;
    while (!(r = await reader.read()).done) {
        yield r.value;
    }
}
/** @ignore */
async function* byobReaderToAsyncIterator(reader) {
    let r;
    let value = yield null;
    while (!(r = await readNext(reader, value, 0)).done) {
        value = yield r.value;
    }
}
/** @ignore */
async function readNext(reader, bufferOrLen, offset) {
    let size;
    let buffer;
    if (typeof bufferOrLen === 'number') {
        buffer = new ArrayBuffer((size = bufferOrLen));
    }
    else if (bufferOrLen instanceof ArrayBuffer) {
        size = (buffer = bufferOrLen).byteLength;
    }
    else if (bufferOrLen instanceof SharedArrayBuf) {
        size = (buffer = bufferOrLen).byteLength;
    }
    else {
        return { done: true, value: undefined };
    }
    return await readInto(reader, buffer, offset, size);
}
/** @ignore */
async function readInto(reader, buffer, offset, size) {
    let innerOffset = offset;
    if (innerOffset >= size) {
        return { done: false, value: new Uint8Array(buffer, 0, size) };
    }
    const { done, value } = await reader.read(new Uint8Array(buffer, innerOffset, size - innerOffset));
    if ((innerOffset += value.byteLength) < size && !done) {
        return await readInto(reader, value.buffer, innerOffset, size);
    }
    return { done, value: new Uint8Array(value.buffer, 0, innerOffset) };
}
/**
 * Creates an async-iterable from an existing DOM stream and optional options.
 *
 * @param {ReadableStream} stream The readable stream to convert to an async-iterable.
 * @param {{ mode: 'byob' }} [options] The optional options to set the mode for the DOM stream.
 * @returns {AsyncIterableX<any>} An async-iterable created from the incoming async-iterable.
 */
export function fromDOMStream(stream, options) {
    return !options || options['mode'] !== 'byob'
        ? new AsyncIterableReadableStream(stream)
        : new AsyncIterableReadableByteStream(stream);
}

//# sourceMappingURL=fromdomstream.mjs.map
