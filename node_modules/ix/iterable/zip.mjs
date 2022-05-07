import { IterableX } from './iterablex';
import { returnIterator } from '../util/returniterator';
export class ZipIterable extends IterableX {
    _sources;
    constructor(sources) {
        super();
        this._sources = sources;
    }
    // eslint-disable-next-line consistent-return
    *[Symbol.iterator]() {
        const sourcesLength = this._sources.length;
        const its = this._sources.map((x) => x[Symbol.iterator]());
        while (sourcesLength > 0) {
            const values = new Array(sourcesLength);
            for (let index = -1; ++index < sourcesLength;) {
                const result = its[index].next();
                if (result.done) {
                    its.forEach(returnIterator);
                    return undefined;
                }
                values[index] = result.value;
            }
            yield values;
        }
    }
}
export function zip(...sources) {
    return new ZipIterable(sources);
}

//# sourceMappingURL=zip.mjs.map
