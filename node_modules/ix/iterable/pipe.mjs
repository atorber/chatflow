import { IterableX } from './iterablex';
import { from } from './from';
export function pipe(source, ...operations) {
    if (operations.length === 0) {
        return source instanceof IterableX ? source : from(source);
    }
    const piped = (input) => {
        return operations.reduce((prev, fn) => fn(prev), input);
    };
    return piped(source);
}

//# sourceMappingURL=pipe.mjs.map
