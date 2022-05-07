import { RaceAsyncIterable } from '../race';
/**
 * Propagates the async sequence that reacts first.
 *
 * @param {...AsyncIterable<T>[]} sources The source sequences.
 * @return {MonoTypeOperatorAsyncFunction<TSource> } An async sequence that surfaces either of the given sequences, whichever reacted first.
 */
export function raceWith(...sources) {
    return function raceWithOperatorFunction(source) {
        return new RaceAsyncIterable([source, ...sources]);
    };
}

//# sourceMappingURL=racewith.mjs.map
