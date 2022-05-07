import { IterableX } from './iterablex';
import { FromIterable } from './from';
import { isIterable, isArrayLike } from '../util/isiterable';
import { identity } from '../util/identity';
/** @nocollapse */
export function as(source) {
    if (source instanceof IterableX) {
        return source;
    }
    if (typeof source === 'string') {
        return new FromIterable([source], identity);
    }
    if (isIterable(source)) {
        return new FromIterable(source, identity);
    }
    if (isArrayLike(source)) {
        return new FromIterable(source, identity);
    }
    return new FromIterable([source], identity);
}

//# sourceMappingURL=as.mjs.map
