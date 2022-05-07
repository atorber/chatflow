import { IterableX } from './iterablex';
class DeferIterable extends IterableX {
    _fn;
    constructor(fn) {
        super();
        this._fn = fn;
    }
    *[Symbol.iterator]() {
        for (const item of this._fn()) {
            yield item;
        }
    }
}
/**
 * Returns an iterable sequence that invokes the specified factory function whenever a call to [Symbol.iterator] has been made.
 *
 * @template TSource The type of the elements in the sequence returned by the factory function, and in the resulting sequence.
 * @param {(() => Iterable<TSource>)} factory iterable factory function to invoke for each call to [Symbol.iterator].
 * @returns {AsyncIterableX<TSource>} An iterable sequence whose observers trigger an invocation of the given iterable factory function.
 */
export function defer(factory) {
    return new DeferIterable(factory);
}

//# sourceMappingURL=defer.mjs.map
