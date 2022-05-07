import { IterableX } from '../../iterable/iterablex';
import { OptionalFindOptions } from '../../iterable/findoptions';
/**
 * @ignore
 */
export declare function countProto<T>(this: IterableX<T>, options?: OptionalFindOptions<T>): number;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        count: typeof countProto;
    }
}
