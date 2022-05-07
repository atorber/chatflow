import { defer } from './defer';
import { empty } from './empty';
/**
 * If the specified condition evaluates true, select the thenSource sequence.
 * Otherwise, select the elseSource sequence.
 *
 * @template TSource The type of the elements in the result sequence.
 * @param {(() => boolean)} condition Condition evaluated to decide which sequence to return.
 * @param {Iterable<TSource>} thenSource Sequence returned in case evaluates true.
 * @param {Iterable<TSource>} [elseSource=empty()] Sequence returned in case condition evaluates false.
 * @returns {IterableX<TSource>} thenSource if condition evaluates true; elseSource otherwise.
 */
export function iif(fn, thenSource, elseSource = empty()) {
    return defer(() => (fn() ? thenSource : elseSource));
}

//# sourceMappingURL=iif.mjs.map
