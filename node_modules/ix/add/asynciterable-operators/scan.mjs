import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ScanAsyncIterable } from '../../asynciterable/operators/scan';
/**
 * @ignore
 */
export function scanProto(options) {
    return new ScanAsyncIterable(this, options);
}
AsyncIterableX.prototype.scan = scanProto;

//# sourceMappingURL=scan.mjs.map
