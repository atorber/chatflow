import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function concatAllProto<T>(this: IterableX<Iterable<T>>): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        concatAll: typeof concatAllProto;
    }
}
