import { IterableX } from '../../iterable/iterablex';
import { ScanOptions } from '../../iterable/operators/scanoptions';
/**
 * @ignore
 */
export declare function scanProto<T, R = T>(this: IterableX<T>, options: ScanOptions<T, R>): IterableX<R>;
export declare function scanProto<T, R = T>(this: IterableX<T>, accumulator: (accumulator: R, current: T, index: number) => R, seed?: R): IterableX<R>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        scan: typeof scanProto;
    }
}
