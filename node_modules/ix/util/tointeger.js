"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInteger = void 0;
/**
 * @ignore
 */
function toInteger(value) {
    const number = Number(value);
    if (isNaN(number)) {
        return 0;
    }
    if (number === 0 || !isFinite(number)) {
        return number;
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
}
exports.toInteger = toInteger;

//# sourceMappingURL=tointeger.js.map
