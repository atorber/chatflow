import { map } from './map';
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
 * @returns {OperatorAsyncFunction<TSource, TResult>} An async-iterable of property values from the source values.
 */
export function pluck(...args) {
    return function pluckOperatorFunction(source) {
        return map(plucker(args, args.length))(source);
    };
}

//# sourceMappingURL=pluck.mjs.map
