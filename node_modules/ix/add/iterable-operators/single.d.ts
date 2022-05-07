import { IterableX } from '../../iterable/iterablex';
import { OptionalFindOptions } from '../../iterable/findoptions';
/**
 * @ignore
 */
export declare function singleProto<T>(this: IterableX<T>, options?: OptionalFindOptions<T>): T | undefined;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        single: typeof singleProto;
    }
}
