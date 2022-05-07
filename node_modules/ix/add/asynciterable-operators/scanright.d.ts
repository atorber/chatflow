import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ScanOptions } from 'ix/asynciterable/operators/scanoptions';
/**
 * @ignore
 */
export declare function scanRightProto<T, R = T>(this: AsyncIterableX<T>, options: ScanOptions<T, R>): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        scanRight: typeof scanRightProto;
    }
}
