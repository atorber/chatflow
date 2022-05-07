"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinMaxDistributiveLattice = void 0;
var Ord_1 = require("./Ord");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
function getMinMaxDistributiveLattice(O) {
    return {
        meet: Ord_1.min(O),
        join: Ord_1.max(O)
    };
}
exports.getMinMaxDistributiveLattice = getMinMaxDistributiveLattice;
