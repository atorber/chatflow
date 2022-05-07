import { AsyncIterableX } from './asynciterablex';
export declare class CombineLatestAsyncIterable<TSource> extends AsyncIterableX<TSource[]> {
    private _sources;
    constructor(sources: AsyncIterable<TSource>[]);
    [Symbol.asyncIterator](signal?: AbortSignal): AsyncGenerator<TSource[], void, unknown>;
}
/**
 * Merges multiple async-iterable sequences into one async-iterable sequence as an array whenever
 * one of the async-iterable sequences produces an element.
 *
 * @template T The type of the elements in the first source sequence.
 * @template T2 The type of the elements in the second source sequence.
 * @param {AsyncIterable<T>} source First async-iterable source.
 * @param {AsyncIterable<T2>} source2 Second async-iterable source.
 * @returns {AsyncIterableX<[T, T2]>} An async-iterable sequence containing an array of all sources.
 */
export declare function combineLatest<T, T2>(source: AsyncIterable<T>, source2: AsyncIterable<T2>): AsyncIterableX<[T, T2]>;
/**
 * Merges multiple async-iterable sequences into one async-iterable sequence as an array whenever
 * one of the async-iterable sequences produces an element.
 *
 * @template T The type of the elements in the first source sequence.
 * @template T2 The type of the elements in the second source sequence.
 * @template T3 The type of the elements in the third source sequence.
 * @param {AsyncIterable<T>} source First async-iterable source.
 * @param {AsyncIterable<T2>} source2 Second async-iterable source.
 * @param {AsyncIterable<T3>} source3 Third async-iterable source.
 * @returns {AsyncIterableX<[T, T2, T3]>} An async-iterable sequence containing an array of all sources.
 */
export declare function combineLatest<T, T2, T3>(source: AsyncIterable<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>): AsyncIterableX<[T, T2, T3]>;
/**
 * Merges multiple async-iterable sequences into one async-iterable sequence as an array whenever
 * one of the async-iterable sequences produces an element.
 *
 * @template T The type of the elements in the first source sequence.
 * @template T2 The type of the elements in the second source sequence.
 * @template T3 The type of the elements in the third source sequence.
 * @template T4 The type of the elements in the fourth source sequence.
 * @param {AsyncIterable<T>} source First async-iterable source.
 * @param {AsyncIterable<T2>} source2 Second async-iterable source.
 * @param {AsyncIterable<T3>} source3 Third async-iterable source.
 * @param {AsyncIterable<T4>} source4 Fourth async-iterable source.
 * @returns {AsyncIterableX<[T, T2, T3, T4]>} An async-iterable sequence containing an array of all sources.
 */
export declare function combineLatest<T, T2, T3, T4>(source: AsyncIterable<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>): AsyncIterableX<[T, T2, T3, T4]>;
/**
 * Merges multiple async-iterable sequences into one async-iterable sequence as an array whenever
 * one of the async-iterable sequences produces an element.
 *
 * @template T The type of the elements in the first source sequence.
 * @template T2 The type of the elements in the second source sequence.
 * @template T3 The type of the elements in the third source sequence.
 * @template T4 The type of the elements in the fourth source sequence.
 * @template T5 The type of the elements in the fifth source sequence.
 * @param {AsyncIterable<T>} source First async-iterable source.
 * @param {AsyncIterable<T2>} source2 Second async-iterable source.
 * @param {AsyncIterable<T3>} source3 Third async-iterable source.
 * @param {AsyncIterable<T4>} source4 Fourth async-iterable source.
 * @param {AsyncIterable<T5>} source5 Fifth async-iterable source.
 * @returns {AsyncIterableX<[T, T2, T3, T4, T5]>} An async-iterable sequence containing an array of all sources.
 */
export declare function combineLatest<T, T2, T3, T4, T5>(source: AsyncIterable<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>, source5: AsyncIterable<T5>): AsyncIterableX<[T, T2, T3, T4, T5]>;
/**
 * Merges multiple async-iterable sequences into one async-iterable sequence as an array whenever
 * one of the async-iterable sequences produces an element.
 *
 * @template T The type of the elements in the first source sequence.
 * @template T2 The type of the elements in the second source sequence.
 * @template T3 The type of the elements in the third source sequence.
 * @template T4 The type of the elements in the fourth source sequence.
 * @template T5 The type of the elements in the fifth source sequence.
 * @template T6 The type of the elements in the sixth source sequence.
 * @param {AsyncIterable<T>} source First async-iterable source.
 * @param {AsyncIterable<T2>} source2 Second async-iterable source.
 * @param {AsyncIterable<T3>} source3 Third async-iterable source.
 * @param {AsyncIterable<T4>} source4 Fourth async-iterable source.
 * @param {AsyncIterable<T5>} source5 Fifth async-iterable source.
 * @param {AsyncIterable<T6>} source6 Sixth async-iterable source.
 * @returns {AsyncIterableX<[T, T2, T3, T4, T5, T6]>} An async-iterable sequence containing an array of all sources.
 */
export declare function combineLatest<T, T2, T3, T4, T5, T6>(source: AsyncIterable<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>, source5: AsyncIterable<T5>, source6: AsyncIterable<T6>): AsyncIterableX<[T, T2, T3, T4, T5, T6]>;
/**
 * Merges multiple async-iterable sequences into one async-iterable sequence as an array whenever
 * one of the async-iterable sequences produces an element.
 *
 * @template T The of the elements in the source sequences.
 * @param {...AsyncIterable<T>[]} sources The async-iterable sources.
 * @returns {AsyncIterableX<T[]>} An async-iterable sequence containing an array of all sources.
 */
export declare function combineLatest<T>(...sources: AsyncIterable<T>[]): AsyncIterableX<T[]>;
