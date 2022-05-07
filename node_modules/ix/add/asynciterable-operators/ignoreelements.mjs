import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ignoreElements } from '../../asynciterable/operators/ignoreelements';
/**
 * @ignore
 */
export function ignoreElementsProto() {
    return ignoreElements()(this);
}
AsyncIterableX.prototype.ignoreElements = ignoreElementsProto;

//# sourceMappingURL=ignoreelements.mjs.map
