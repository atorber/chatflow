"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineLatestWith = void 0;
const combinelatest_1 = require("../combinelatest");
function combineLatestWith(...sources) {
    return function combineLatestOperatorFunction(source) {
        return new combinelatest_1.CombineLatestAsyncIterable([source, ...sources]);
    };
}
exports.combineLatestWith = combineLatestWith;

//# sourceMappingURL=combinelatestwith.js.map
