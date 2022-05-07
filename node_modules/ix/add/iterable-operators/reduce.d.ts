import { IterableX } from '../../iterable/iterablex';
import { ReduceOptions } from '../../iterable/reduceoptions';
/**
 * @ignore
 */
export declare function reduceProto<T, R = T>(this: IterableX<T>, options: ReduceOptions<T, R>): R;
export declare function reduceProto<T, R = T>(this: IterableX<T>, accumulator: (accumulator: R, current: T, index: number) => R, seed?: R): R;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        reduce: typeof reduceProto;
    }
}
