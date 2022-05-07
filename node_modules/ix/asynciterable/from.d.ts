import { AsyncIterableInput, AsyncIterableX } from './asynciterablex';
import { Observable } from '../observer';
export declare let from: <TSource, TResult = TSource>(source: AsyncIterableInput<TSource>, selector?: (value: TSource, index: number) => TResult | Promise<TResult>, thisArg?: any) => AsyncIterableX<TResult>;
export declare let FromArrayIterable: new <TSource, TResult = TSource>(source: ArrayLike<TSource>, selector: (value: TSource, index: number) => TResult | Promise<TResult>) => AsyncIterableX<TResult>;
export declare let FromAsyncIterable: new <TSource, TResult = TSource>(source: Iterable<TSource | PromiseLike<TSource>> | AsyncIterable<TSource>, selector: (value: TSource, index: number) => TResult | Promise<TResult>) => AsyncIterableX<TResult>;
export declare let FromPromiseIterable: new <TSource, TResult = TSource>(source: PromiseLike<TSource>, selector: (value: TSource, index: number) => TResult | Promise<TResult>) => AsyncIterableX<TResult>;
export declare let FromObservableAsyncIterable: new <TSource, TResult = TSource>(observable: Observable<TSource>, selector: (value: TSource, index: number) => TResult | Promise<TResult>) => AsyncIterableX<TResult>;
export declare function _initialize(Ctor: typeof AsyncIterableX): void;
