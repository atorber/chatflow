import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function includesProto<T>(this: AsyncIterableX<T>, searchElement: T, fromIndex: number): Promise<boolean>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        includes: typeof includesProto;
    }
}
