import { IterableX } from '../../iterable/iterablex';
import { ScanIterable } from '../../iterable/operators/scan';
export function scanProto(optionsOrAccumulator, seed) {
    return new ScanIterable(this, 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator);
}
IterableX.prototype.scan = scanProto;

//# sourceMappingURL=scan.mjs.map
