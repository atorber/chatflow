import { toArray } from './toarray';
export function reduceRight(source, optionsOrAccumulator, seed) {
    const options = 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 2
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator;
    const { ['seed']: _seed, ['callback']: callback } = options;
    const hasSeed = options.hasOwnProperty('seed');
    const array = toArray(source);
    let hasValue = false;
    let acc = _seed;
    for (let offset = array.length - 1; offset >= 0; offset--) {
        const item = array[offset];
        if (hasValue || (hasValue = hasSeed)) {
            acc = callback(acc, item, offset);
        }
        else {
            acc = item;
            hasValue = true;
        }
    }
    if (!(hasSeed || hasValue)) {
        throw new Error('Sequence contains no elements');
    }
    return acc;
}

//# sourceMappingURL=reduceright.mjs.map
