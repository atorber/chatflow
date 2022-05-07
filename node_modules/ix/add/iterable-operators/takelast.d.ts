import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function takeLastProto<T>(this: IterableX<T>, count: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        takeLast: typeof takeLastProto;
    }
}
