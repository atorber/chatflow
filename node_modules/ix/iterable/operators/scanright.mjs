import { IterableX } from '../iterablex';
import { toArray } from '../toarray';
export class ScanRightIterable extends IterableX {
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
        let hasValue = false;
        let acc = this._seed;
        const source = toArray(this._source);
        for (let offset = source.length - 1; offset >= 0; offset--) {
            const item = source[offset];
            if (hasValue || (hasValue = this._hasSeed)) {
                acc = this._fn(acc, item, offset);
                yield acc;
            }
            else {
                acc = item;
                hasValue = true;
            }
        }
    }
}
export function scanRight(optionsOrAccumulator, seed) {
    const options = 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator;
    return function scanRightOperatorFunction(source) {
        return new ScanRightIterable(source, options);
    };
}

//# sourceMappingURL=scanright.mjs.map
