import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { catchError as _catchError } from '../../asynciterable/operators/catcherror';
/**
 * @ignore
 */
export declare function catchProto<T, R>(this: AsyncIterableX<T>, handler: (error: any) => AsyncIterable<R> | Promise<AsyncIterable<R>>): AsyncIterableX<T | R>;
export declare namespace asynciterable {
    let catchError: typeof _catchError;
}
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        catchError: typeof catchProto;
    }
}
