import { IterableX } from '../../iterable/iterablex';
import { FindOptions } from '../../iterable/findoptions';
/**
 * @ignore
 */
export declare function findIndexProto<T>(this: IterableX<T>, options: FindOptions<T>): number;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        findIndex: typeof findIndexProto;
    }
}
