import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ReduceOptions } from '../../asynciterable/reduceoptions';
/**
 * @ignore
 */
export declare function reduceRightProto<T, R = T>(this: AsyncIterableX<T>, options: ReduceOptions<T, R>): Promise<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        reduceRight: typeof reduceRightProto;
    }
}
