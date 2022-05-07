import { CombineLatestAsyncIterable } from '../combinelatest';
export function combineLatestWith(...sources) {
    return function combineLatestOperatorFunction(source) {
        return new CombineLatestAsyncIterable([source, ...sources]);
    };
}

//# sourceMappingURL=combinelatestwith.mjs.map
