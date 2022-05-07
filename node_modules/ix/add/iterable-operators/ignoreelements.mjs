import { IterableX } from '../../iterable/iterablex';
import { ignoreElements } from '../../iterable/operators/ignoreelements';
/**
 * @ignore
 */
export function ignoreElementsProto() {
    return ignoreElements()(this);
}
IterableX.prototype.ignoreElements = ignoreElementsProto;

//# sourceMappingURL=ignoreelements.mjs.map
