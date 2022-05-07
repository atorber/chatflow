import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ScanRightAsyncIterable } from '../../asynciterable/operators/scanright';
/**
 * @ignore
 */
export function scanRightProto(options) {
    return new ScanRightAsyncIterable(this, options);
}
AsyncIterableX.prototype.scanRight = scanRightProto;

//# sourceMappingURL=scanright.mjs.map
