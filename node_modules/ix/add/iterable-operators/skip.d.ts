import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function skipProto<T>(this: IterableX<T>, count: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        skip: typeof skipProto;
    }
}
