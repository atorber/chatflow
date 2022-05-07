"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const concat_1 = require("../../iterable/concat");
/**
 * @ignore
 */
function concatProto(...args) {
    // @ts-ignore
    return new concat_1.ConcatIterable([this, ...args]);
}
exports.concatProto = concatProto;
iterablex_1.IterableX.prototype.concat = concatProto;

//# sourceMappingURL=concat.js.map
