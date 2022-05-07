import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class SkipWhileAsyncIterable extends AsyncIterableX {
    _source;
    _predicate;
    constructor(source, predicate) {
        super();
        this._source = source;
        this._predicate = predicate;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let yielding = false;
        let i = 0;
        for await (const element of wrapWithAbort(this._source, signal)) {
            if (!yielding && !(await this._predicate(element, i++, signal))) {
                yielding = true;
            }
            if (yielding) {
                yield element;
            }
        }
    }
}
/**
 * Bypasses elements in an async-iterale sequence as long as a specified condition is true
 * and then returns the remaining elements.
 *
 * @template T The type of the elements in the source sequence.
 * @param {((value: T, index: number, signal?: AbortSignal) => boolean | Promise<boolean>)} predicate A function to test each element for a condition.
 * @returns {OperatorAsyncFunction<T, T>} An async-iterable sequence that contains the elements from the input
 * sequence starting at the first element in the linear series that does not pass the test specified by predicate.
 */
export function skipWhile(predicate) {
    return function skipWhileOperatorFunction(source) {
        return new SkipWhileAsyncIterable(source, predicate);
    };
}

//# sourceMappingURL=skipwhile.mjs.map
