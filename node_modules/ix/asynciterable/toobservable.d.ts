import { Observable } from '../observer';
/**
 * Converts the async-iterable sequence to an observable.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The async-iterable to convert to an observable.
 * @returns {Observable<TSource>} The observable containing the elements from the async-iterable.
 */
export declare function toObservable<TSource>(source: AsyncIterable<TSource>): Observable<TSource>;
