import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function reverseProto<T>(this: IterableX<T>): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        reverse: typeof reverseProto;
    }
}
