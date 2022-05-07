import { IterableX } from '../../iterable/iterablex';
import { reduce } from '../../iterable/reduce';
export function reduceProto(optionsOrAccumulator, seed) {
    return reduce(this, 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator);
}
IterableX.prototype.reduce = reduceProto;

//# sourceMappingURL=reduce.mjs.map
