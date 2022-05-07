import { IterableX } from '../../iterable/iterablex';
import { DefaultIfEmptyIterable } from '../../iterable/operators/defaultifempty';
/**
 * @ignore
 */
export function defaultIfEmptyProto(defaultValue) {
    return new DefaultIfEmptyIterable(this, defaultValue);
}
IterableX.prototype.defaultIfEmpty = defaultIfEmptyProto;

//# sourceMappingURL=defaultifempty.mjs.map
