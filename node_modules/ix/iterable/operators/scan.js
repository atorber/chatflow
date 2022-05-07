"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.ScanIterable = void 0;
const iterablex_1 = require("../iterablex");
class ScanIterable extends iterablex_1.IterableX {
    _source;
    _fn;
    _seed;
    _hasSeed;
    constructor(source, options) {
        super();
        this._source = source;
        this._fn = options['callback'];
        this._hasSeed = options.hasOwnProperty('seed');
        this._seed = options['seed'];
    }
    *[Symbol.iterator]() {
        let i = 0;
        let hasValue = false;
        let acc = this._seed;
        for (const item of this._source) {
            if (hasValue || (hasValue = this._hasSeed)) {
                acc = this._fn(acc, item, i++);
                yield acc;
            }
            else {
                acc = item;
                hasValue = true;
                i++;
            }
        }
        if (i === 1 && !this._hasSeed) {
            yield acc;
        }
    }
}
exports.ScanIterable = ScanIterable;
function scan(optionsOrAccumulator, seed) {
    const options = 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator;
    return function scanOperatorFunction(source) {
        return new ScanIterable(source, options);
    };
}
exports.scan = scan;

//# sourceMappingURL=scan.js.map
