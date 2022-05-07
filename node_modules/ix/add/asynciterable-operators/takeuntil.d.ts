import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function takeUntilProto<T>(this: AsyncIterableX<T>, other: (signal?: AbortSignal) => Promise<any>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        takeUntil: typeof takeUntilProto;
    }
}
