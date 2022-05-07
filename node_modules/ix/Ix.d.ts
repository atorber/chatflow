import { AbortError } from './aborterror';
import { AsyncSink } from './asynciterable/asyncsink';
import { IterableX } from './iterable/iterablex';
import { observable } from './observer';
import { AsyncIterableX } from './asynciterable/asynciterablex';
import { GroupedIterable as ImportedGroupedIterable } from './iterable/operators/groupby';
import { GroupedAsyncIterable as ImportedGroupedAsyncIterable } from './asynciterable/operators/groupby';
export { OrderedIterableX as OrderedIterable } from './iterable/operators/orderby';
export { OrderedIterableBaseX as OrderedIterableBase } from './iterable/operators/orderby';
export { OrderedAsyncIterableX as OrderedAsyncIterable } from './asynciterable/operators/orderby';
export { OrderedAsyncIterableBaseX as OrderedAsyncIterableBase } from './asynciterable/operators/orderby';
export { observable as symbolObservable };
export { AbortError, AsyncSink, IterableX as Iterable, AsyncIterableX as AsyncIterable };
declare const _default: {
    AbortError: typeof AbortError;
    AsyncSink: typeof AsyncSink;
    Iterable: typeof IterableX;
    AsyncIterable: typeof AsyncIterableX;
    symbolObservable: string | symbol;
};
export default _default;
export declare type GroupedIterable<TKey, TValue> = ImportedGroupedIterable<TKey, TValue>;
export declare type GroupedAsyncIterable<TKey, TValue> = ImportedGroupedAsyncIterable<TKey, TValue>;
declare global {
    interface AsyncIterable<T> {
        [Symbol.asyncIterator](signal?: AbortSignal): AsyncIterator<T>;
    }
    interface AsyncIterableIterator<T> extends AsyncIterator<T> {
        [Symbol.asyncIterator](signal?: AbortSignal): AsyncIterableIterator<T>;
    }
}
