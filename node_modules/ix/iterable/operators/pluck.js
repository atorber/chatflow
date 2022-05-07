"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluck = void 0;
const map_1 = require("./map");
function plucker(props, length) {
    const mapper = (x) => {
        let currentProp = x;
        for (let i = 0; i < length; i++) {
            const p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}
/**
 * Maps each source value to its specified nested property.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the result sequence, obtained by the property names.
 * @param {...string[]} args The nested properties to pluck from each source value.
 * @returns {OperatorAsyncFunction<TSource, TResult>} An iterable of property values from the source values.
 */
function pluck(...args) {
    return function pluckOperatorFunction(source) {
        return new map_1.MapIterable(source, plucker(args, args.length));
    };
}
exports.pluck = pluck;

//# sourceMappingURL=pluck.js.map
