import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { Observable } from '../../observer';
/**
 * @ignore
 */
export declare function toObservableProto<TSource>(this: AsyncIterableX<TSource>): Observable<TSource>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toObservable: typeof toObservableProto;
    }
}
