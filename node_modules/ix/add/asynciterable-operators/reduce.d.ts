import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ReduceOptions } from '../../asynciterable/reduceoptions';
/**
 * @ignore
 */
export declare function reduceProto<T, R = T>(this: AsyncIterableX<T>, options: ReduceOptions<T, R>): Promise<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        reduce: typeof reduceProto;
    }
}
