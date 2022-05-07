import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { reduceRight } from '../../asynciterable/reduceright';
/**
 * @ignore
 */
export async function reduceRightProto(options) {
    return reduceRight(this, options);
}
AsyncIterableX.prototype.reduceRight = reduceRightProto;

//# sourceMappingURL=reduceright.mjs.map
