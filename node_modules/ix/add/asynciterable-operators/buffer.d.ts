import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function bufferProto<T>(this: AsyncIterableX<T>, count: number, skip?: number): AsyncIterableX<T[]>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        buffer: typeof bufferProto;
    }
}
