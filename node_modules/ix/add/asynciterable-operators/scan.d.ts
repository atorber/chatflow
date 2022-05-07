import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ScanOptions } from '../../asynciterable/operators/scanoptions';
/**
 * @ignore
 */
export declare function scanProto<T, R = T>(this: AsyncIterableX<T>, options: ScanOptions<T, R>): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        scan: typeof scanProto;
    }
}
