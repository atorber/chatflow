import { IterableX } from '../iterablex';
export class ScanIterable extends IterableX {
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
export function scan(optionsOrAccumulator, seed) {
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

//# sourceMappingURL=scan.mjs.map
