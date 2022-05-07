import { concat } from '../concat';
import { whileDo } from '../whiledo';
/**
 * Generates an async-iterable sequence by repeating a source sequence as long as the given loop postcondition holds.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {(() => boolean)} condition Loop condition.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that generates an async-iterable by repeating a
 * source sequence while the postcondition holds.
 */
export function doWhile(condition) {
    return function doWhileOperatorFunction(source) {
        return concat(source, whileDo(source, condition));
    };
}

//# sourceMappingURL=dowhile.mjs.map
