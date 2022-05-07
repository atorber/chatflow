import { IterableX } from '../../iterable/iterablex';
import { publish } from '../../iterable/operators/publish';
/**
 * @ignore
 */
export function publishProto(selector) {
    return publish(selector)(this);
}
IterableX.prototype.publish = publishProto;

//# sourceMappingURL=publish.mjs.map
