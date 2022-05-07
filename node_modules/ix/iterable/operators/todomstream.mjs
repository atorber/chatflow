import { toDOMStream as toDOMStreamOperator } from '../../iterable/todomstream';
export function toDOMStream(options) {
    return function toDOMStreamOperatorFunction(source) {
        if (!options || !('type' in options) || options['type'] !== 'bytes') {
            return toDOMStreamOperator(source, options);
        }
        return toDOMStreamOperator(source, options);
    };
}

//# sourceMappingURL=todomstream.mjs.map
