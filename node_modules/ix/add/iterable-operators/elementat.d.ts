import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function elementAtProto<T>(this: IterableX<T>, index: number): T | undefined;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        elementAt: typeof elementAtProto;
    }
}
