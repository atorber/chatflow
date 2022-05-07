import { IterableX } from './iterablex';
/** @nocollapse */
export declare let from: <TSource, TResult = TSource>(source: Iterable<TSource> | Iterator<TSource> | ArrayLike<TSource>, selector?: (value: TSource, index: number) => TResult, thisArg?: any) => IterableX<TResult>;
/** @nocollapse */
export declare let FromIterable: new <TSource, TResult = TSource>(source: Iterable<TSource> | ArrayLike<TSource>, selector: (value: TSource, index: number) => TResult) => IterableX<TResult>;
export declare function _initialize(Ctor: typeof IterableX): void;
