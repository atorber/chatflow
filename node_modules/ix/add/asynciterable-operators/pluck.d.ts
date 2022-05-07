import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function pluckProto<T, R>(this: AsyncIterableX<T>, ...args: string[]): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        pluck: typeof pluckProto;
    }
}
