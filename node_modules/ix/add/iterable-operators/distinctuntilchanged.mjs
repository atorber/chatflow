import { IterableX } from '../../iterable/iterablex';
import { distinctUntilChanged } from '../../iterable/operators/distinctuntilchanged';
/**
 * @ignore
 */
export function distinctUntilChangedProto(options) {
    return distinctUntilChanged(options)(this);
}
IterableX.prototype.distinctUntilChanged = distinctUntilChangedProto;

//# sourceMappingURL=distinctuntilchanged.mjs.map
