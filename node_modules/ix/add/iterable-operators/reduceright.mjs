import { IterableX } from '../../iterable/iterablex';
import { reduceRight } from '../../iterable/reduceright';
export function reduceRightProto(optionsOrAccumulator, seed) {
    return reduceRight(this, 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator);
}
IterableX.prototype.reduceRight = reduceRightProto;

//# sourceMappingURL=reduceright.mjs.map
