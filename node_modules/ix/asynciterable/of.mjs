import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
export class OfAsyncIterable extends AsyncIterableX {
    _args;
    constructor(args) {
        super();
        this._args = args;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for (const item of this._args) {
            yield item;
        }
    }
}
/**
 * Creates an async-iterable from the specified elements.
 *
 * @template TSource The type of the elements to create an async-iterable sequence.
 * @param {...TSource[]} args The elements to turn into an async-iterable sequence.
 * @returns {AsyncIterableX<TSource>} The async-iterable sequence created from the elements.
 */
export function of(...args) {
    return new OfAsyncIterable(args);
}

//# sourceMappingURL=of.mjs.map
