import { IterableX } from '../../iterable/iterablex';
import { FindOptions } from '../../iterable/findoptions';
/**
 * @ignore
 */
export declare function everyProto<T>(this: IterableX<T>, options: FindOptions<T>): boolean;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        every: typeof everyProto;
    }
}
