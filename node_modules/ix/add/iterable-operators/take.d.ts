import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function takeProto<T>(this: IterableX<T>, count: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        take: typeof takeProto;
    }
}
