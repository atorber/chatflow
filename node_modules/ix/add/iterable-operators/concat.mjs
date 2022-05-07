import { IterableX } from '../../iterable/iterablex';
import { ConcatIterable } from '../../iterable/concat';
/**
 * @ignore
 */
export function concatProto(...args) {
    // @ts-ignore
    return new ConcatIterable([this, ...args]);
}
IterableX.prototype.concat = concatProto;

//# sourceMappingURL=concat.mjs.map
