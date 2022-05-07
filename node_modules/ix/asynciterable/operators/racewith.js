"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raceWith = void 0;
const race_1 = require("../race");
/**
 * Propagates the async sequence that reacts first.
 *
 * @param {...AsyncIterable<T>[]} sources The source sequences.
 * @return {MonoTypeOperatorAsyncFunction<TSource> } An async sequence that surfaces either of the given sequences, whichever reacted first.
 */
function raceWith(...sources) {
    return function raceWithOperatorFunction(source) {
        return new race_1.RaceAsyncIterable([source, ...sources]);
    };
}
exports.raceWith = raceWith;

//# sourceMappingURL=racewith.js.map
