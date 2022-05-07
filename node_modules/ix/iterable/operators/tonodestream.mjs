import { IterableReadable } from '../../iterable/tonodestream';
export function toNodeStream(options) {
    return function toNodeStreamOperatorFunction(source) {
        return !options || options.objectMode === true
            ? new IterableReadable(source, options)
            : new IterableReadable(source, options);
    };
}

//# sourceMappingURL=tonodestream.mjs.map
