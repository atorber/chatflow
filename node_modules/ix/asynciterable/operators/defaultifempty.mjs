import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class DefaultIfEmptyAsyncIterable extends AsyncIterableX {
    _source;
    _defaultValue;
    constructor(source, defaultValue) {
        super();
        this._source = source;
        this._defaultValue = defaultValue;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let state = 1;
        for await (const item of wrapWithAbort(this._source, signal)) {
            state = 2;
            yield item;
        }
        if (state === 1) {
            yield this._defaultValue;
        }
    }
}
/**
 * Returns the elements of the specified sequence or the default value in a singleton sequence
 * if the sequence is empty.
 *
 * @template T The type of elements in the source sequence.
 * @param {T} defaultValue The value to return if the sequence is empty.
 * @returns {MonoTypeOperatorAsyncFunction<T>} An operator which returns the elements of the source sequence or the default value as a singleton.
 */
export function defaultIfEmpty(defaultValue) {
    return function defaultIfEmptyOperatorFunction(source) {
        return new DefaultIfEmptyAsyncIterable(source, defaultValue);
    };
}

//# sourceMappingURL=defaultifempty.mjs.map
