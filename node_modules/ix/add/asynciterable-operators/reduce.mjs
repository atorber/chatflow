import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { reduce } from '../../asynciterable/reduce';
/**
 * @ignore
 */
export async function reduceProto(options) {
    return reduce(this, options);
}
AsyncIterableX.prototype.reduce = reduceProto;

//# sourceMappingURL=reduce.mjs.map
