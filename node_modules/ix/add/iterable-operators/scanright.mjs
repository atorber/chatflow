import { IterableX } from '../../iterable/iterablex';
import { ScanRightIterable } from '../../iterable/operators/scanright';
export function scanRightProto(optionsOrAccumulator, seed) {
    return new ScanRightIterable(this, 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator);
}
IterableX.prototype.scanRight = scanRightProto;

//# sourceMappingURL=scanright.mjs.map
