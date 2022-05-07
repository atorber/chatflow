import { AsyncIterableX } from '../asynciterablex';
import { createGrouping } from './_grouping';
import { identity } from '../../util/identity';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class JoinAsyncIterable extends AsyncIterableX {
    _outer;
    _inner;
    _outerSelector;
    _innerSelector;
    _resultSelector;
    constructor(outer, inner, outerSelector, innerSelector, resultSelector) {
        super();
        this._outer = outer;
        this._inner = inner;
        this._outerSelector = outerSelector;
        this._innerSelector = innerSelector;
        this._resultSelector = resultSelector;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const map = await createGrouping(this._inner, this._innerSelector, identity, signal);
        for await (const outerElement of wrapWithAbort(this._outer, signal)) {
            const outerKey = await this._outerSelector(outerElement, signal);
            if (map.has(outerKey)) {
                for (const innerElement of map.get(outerKey)) {
                    yield await this._resultSelector(outerElement, innerElement, signal);
                }
            }
        }
    }
}
/**
 * Correlates the elements of two sequences based on matching keys.
 *
 * @template TOuter The type of the elements of the first async-iterable sequence.
 * @template TInner The type of the elements of the second async-iterable sequence.
 * @template TKey The type of the keys returned by the key selector functions.
 * @template TResult The type of the result elements.
 * @param {AsyncIterable<TInner>} inner The async-enumerable sequence to join to the first sequence.
 * @param {((value: TOuter, signal?: AbortSignal) => TKey | Promise<TKey>)} outerSelector A function to extract the join key from each element
 * of the first sequence.
 * @param {((value: TInner, signal?: AbortSignal) => TKey | Promise<TKey>)} innerSelector A function to extract the join key from each element
 * of the second sequence.
 * @param {((outer: TOuter, inner: TInner, signal?: AbortSignal) => TResult | Promise<TResult>)} resultSelector A function to create a result element
 * from two matching elements.
 * @returns {OperatorAsyncFunction<TOuter, TResult>} An async-iterable sequence that has elements that are obtained by performing an inner join
 * on two sequences.
 */
export function innerJoin(inner, outerSelector, innerSelector, resultSelector) {
    return function innerJoinOperatorFunction(outer) {
        return new JoinAsyncIterable(outer, inner, outerSelector, innerSelector, resultSelector);
    };
}

//# sourceMappingURL=innerjoin.mjs.map
