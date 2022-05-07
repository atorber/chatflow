"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = exports.ZipIterable = void 0;
const iterablex_1 = require("./iterablex");
const returniterator_1 = require("../util/returniterator");
class ZipIterable extends iterablex_1.IterableX {
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
                    its.forEach(returniterator_1.returnIterator);
                    return undefined;
                }
                values[index] = result.value;
            }
            yield values;
        }
    }
}
exports.ZipIterable = ZipIterable;
function zip(...sources) {
    return new ZipIterable(sources);
}
exports.zip = zip;

//# sourceMappingURL=zip.js.map
