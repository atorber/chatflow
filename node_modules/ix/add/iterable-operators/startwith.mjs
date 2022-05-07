import { IterableX } from '../../iterable/iterablex';
import { startWith } from '../../iterable/operators/startwith';
/**
 * @ignore
 */
export function startWithProto(...args) {
    return startWith(...args)(this);
}
IterableX.prototype.startWith = startWithProto;

//# sourceMappingURL=startwith.mjs.map
