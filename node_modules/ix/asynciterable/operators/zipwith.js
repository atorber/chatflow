"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipWith = void 0;
const zip_1 = require("../zip");
function zipWith(...sources) {
    return function zipWithOperatorFunction(source) {
        return new zip_1.ZipAsyncIterable([source, ...sources]);
    };
}
exports.zipWith = zipWith;

//# sourceMappingURL=zipwith.js.map
