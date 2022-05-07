"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeWith = void 0;
const merge_1 = require("../merge");
function mergeWith(...args) {
    return function mergeWithOperatorFunction(source) {
        return new merge_1.MergeAsyncIterable([source, ...args]);
    };
}
exports.mergeWith = mergeWith;

//# sourceMappingURL=mergewith.js.map
