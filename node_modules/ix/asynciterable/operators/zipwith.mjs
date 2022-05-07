import { ZipAsyncIterable } from '../zip';
export function zipWith(...sources) {
    return function zipWithOperatorFunction(source) {
        return new ZipAsyncIterable([source, ...sources]);
    };
}

//# sourceMappingURL=zipwith.mjs.map
