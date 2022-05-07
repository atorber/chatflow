import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function catchErrorProto<T, R>(this: IterableX<T>, fn: (error: any) => Iterable<R>): IterableX<T | R>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        catchError: typeof catchErrorProto;
    }
}
