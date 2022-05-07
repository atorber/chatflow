import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function bufferProto<T>(this: IterableX<T>, count: number, skip?: number): IterableX<T[]>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        buffer: typeof bufferProto;
    }
}
