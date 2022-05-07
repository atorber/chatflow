import { IterableX } from './iterablex';
class AnonymousIterable extends IterableX {
    _fn;
    constructor(fn) {
        super();
        this._fn = fn;
    }
    [Symbol.iterator]() {
        return this._fn();
    }
}
/**
 * Creates a new iterable using the specified function implementing the members of AsyncIterable
 *
 * @template T The type of the elements returned by the iterable sequence.
 * @param {(() => Iterator<T>)} fn The function that creates the [Symbol.iterator]() method
 * @returns {IterableX<T>} A new iterable instance.
 */
export function create(getIterator) {
    return new AnonymousIterable(getIterator);
}

//# sourceMappingURL=create.mjs.map
