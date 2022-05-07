import { IterableX } from '../iterablex';
export class BufferIterable extends IterableX {
    _source;
    _count;
    _skip;
    constructor(source, count, skip) {
        super();
        this._source = source;
        this._count = count;
        this._skip = skip;
    }
    *[Symbol.iterator]() {
        const buffers = [];
        let i = 0;
        for (const item of this._source) {
            if (i % this._skip === 0) {
                buffers.push([]);
            }
            for (const buff of buffers) {
                buff.push(item);
            }
            if (buffers.length > 0 && buffers[0].length === this._count) {
                yield buffers.shift();
            }
            i++;
        }
        while (buffers.length > 0) {
            yield buffers.shift();
        }
    }
}
/**
 * Generates a sequence of buffers over the source sequence, with specified length and possible overlap.
 * @example <caption>Creates a sequence of buffers with and without skip</caption>
 * const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
 *
 * // Without skip
 * const result = buffer(source, 5);
 * const result = Ix.Iterable.from(source).buffer(5);
 * for (const item of result) {
 *   console.log(result);
 * }
 * // => [0, 1, 2, 3, 4]
 * // => [5, 6, 7, 8, 9]
 *
 * // With skip
 * const result = buffer(source, 3, 4);
 * const result = Ix.Iterable.from(source).buffer(3, 4);
 * for (const item of result) {
 *   console.log(result);
 * }
 * // => [0, 1, 2]
 * // => [4, 5, 6]
 * // => [8, 9]
 * @param {Iterabel<TSource>} source Source sequence
 * @param {number} count Number of elements for allocated buffers.
 * @param {number} [skip] Number of elements to skip between the start of consecutive buffers. If not specified, defaults
 * to the count.
 * @return {IterableX<TSource>[]} Sequence of buffers containing source sequence elements
 */
export function buffer(count, skip) {
    let s = skip;
    if (s == null) {
        s = count;
    }
    return function bufferOperatorFunction(source) {
        return new BufferIterable(source, count, s);
    };
}

//# sourceMappingURL=buffer.mjs.map
