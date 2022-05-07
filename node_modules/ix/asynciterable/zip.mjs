import { wrapWithAbort } from './operators/withabort';
import { AsyncIterableX } from './asynciterablex';
import { returnAsyncIterator } from '../util/returniterator';
import { throwIfAborted } from '../aborterror';
export class ZipAsyncIterable extends AsyncIterableX {
    _sources;
    constructor(sources) {
        super();
        this._sources = sources;
    }
    // eslint-disable-next-line consistent-return
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const sourcesLength = this._sources.length;
        const its = this._sources.map((x) => wrapWithAbort(x, signal)[Symbol.asyncIterator]());
        while (sourcesLength > 0) {
            const values = new Array(sourcesLength);
            for (let i = -1; ++i < sourcesLength;) {
                const { value, done } = await its[i].next();
                if (done) {
                    await Promise.all(its.map(returnAsyncIterator));
                    return undefined;
                }
                values[i] = value;
            }
            yield values;
        }
    }
}
export function zip(...sources) {
    return new ZipAsyncIterable(sources);
}

//# sourceMappingURL=zip.mjs.map
