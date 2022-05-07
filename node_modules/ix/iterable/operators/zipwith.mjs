import { ZipIterable } from '../zip';
export function zipWith(...sources) {
    return function zipWithOperatorFunction(source) {
        return new ZipIterable([source, ...sources]);
    };
}

//# sourceMappingURL=zipwith.mjs.map
