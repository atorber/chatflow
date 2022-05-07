import { IterableX } from '../../iterable/iterablex';
import { FindOptions } from '../../iterable/findoptions';
/**
 * @ignore
 */
export declare function someProto<T>(this: IterableX<T>, options: FindOptions<T>): boolean;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        some: typeof someProto;
    }
}
