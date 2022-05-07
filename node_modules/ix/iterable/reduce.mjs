export function reduce(source, optionsOrAccumulator, seed) {
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
    let i = 0;
    let hasValue = false;
    let acc = _seed;
    for (const item of source) {
        if (hasValue || (hasValue = hasSeed)) {
            acc = callback(acc, item, i++);
        }
        else {
            acc = item;
            hasValue = true;
            i++;
        }
    }
    if (!(hasSeed || hasValue)) {
        throw new Error('Sequence contains no elements');
    }
    return acc;
}

//# sourceMappingURL=reduce.mjs.map
