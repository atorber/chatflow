"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultIfEmptyProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const defaultifempty_1 = require("../../iterable/operators/defaultifempty");
/**
 * @ignore
 */
function defaultIfEmptyProto(defaultValue) {
    return new defaultifempty_1.DefaultIfEmptyIterable(this, defaultValue);
}
exports.defaultIfEmptyProto = defaultIfEmptyProto;
iterablex_1.IterableX.prototype.defaultIfEmpty = defaultIfEmptyProto;

//# sourceMappingURL=defaultifempty.js.map
