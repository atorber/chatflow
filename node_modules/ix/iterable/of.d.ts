import { IterableX } from './iterablex';
/**
 * Creates an iterable from the specified elements.
 *
 * @template TSource The type of the elements to create an iterable sequence.
 * @param {...TSource[]} args The elements to turn into an iterable sequence.
 * @returns {IterableX<TSource>} The iterable sequence created from the elements.
 */
export declare function of<TSource>(...args: TSource[]): IterableX<TSource>;
export declare class OfIterable<TSource> extends IterableX<TSource> {
    private _args;
    constructor(args: TSource[]);
    [Symbol.iterator](): Generator<TSource, void, undefined>;
}
