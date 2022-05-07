import { IterableX } from '../../iterable/iterablex';
import { FindOptions } from 'ix/iterable/findoptions';
/**
 * @ignore
 */
export declare function findProto<T>(this: IterableX<T>, options: FindOptions<T>): T | undefined;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        find: typeof findProto;
    }
}
