import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { publish } from '../../asynciterable/operators/publish';
/**
 * @ignore
 */
export function publishProto(selector) {
    return publish(selector)(this);
}
AsyncIterableX.prototype.publish = publishProto;

//# sourceMappingURL=publish.mjs.map
