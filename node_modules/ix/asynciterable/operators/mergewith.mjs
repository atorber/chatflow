import { MergeAsyncIterable } from '../merge';
export function mergeWith(...args) {
    return function mergeWithOperatorFunction(source) {
        return new MergeAsyncIterable([source, ...args]);
    };
}

//# sourceMappingURL=mergewith.mjs.map
