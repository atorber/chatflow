import { AsyncIterableReadable } from '../tonodestream';
export function toNodeStream(options) {
    return function toNodeStreamOperatorFunction(source) {
        return !options || options.objectMode === true
            ? new AsyncIterableReadable(source, options)
            : new AsyncIterableReadable(source, options);
    };
}

//# sourceMappingURL=tonodestream.mjs.map
