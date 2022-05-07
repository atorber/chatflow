import { AsyncIterableX } from './asynciterablex';
import { isIterable, isAsyncIterable, isArrayLike, isObservable, isPromise, } from '../util/isiterable';
import { identityAsync } from '../util/identity';
import { FromObservableAsyncIterable, FromPromiseIterable, FromAsyncIterable, FromArrayIterable, } from './from';
/**
 * Converts the input into an async-iterable sequence.
 *
 * @param {*} source The source to convert to an async-iterable sequence.
 * @returns {AsyncIterableX<*>} An async-iterable containing the input.
 */
/** @nocollapse */
export function as(source) {
    if (source instanceof AsyncIterableX) {
        return source;
    }
    if (typeof source === 'string') {
        return new FromArrayIterable([source], identityAsync);
    }
    if (isIterable(source) || isAsyncIterable(source)) {
        return new FromAsyncIterable(source, identityAsync);
    }
    if (isPromise(source)) {
        return new FromPromiseIterable(source, identityAsync);
    }
    if (isObservable(source)) {
        return new FromObservableAsyncIterable(source, identityAsync);
    }
    if (isArrayLike(source)) {
        return new FromArrayIterable(source, identityAsync);
    }
    return new FromArrayIterable([source], identityAsync);
}

//# sourceMappingURL=as.mjs.map
