"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = exports.zero = exports.and = exports.or = exports.not = exports.id = exports.fromEitherK = exports.fromOptionK = void 0;
var _ = __importStar(require("./internal"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Returns a `Refinement` from a `Option` returning function.
 * This function ensures that a `Refinement` definition is type-safe.
 *
 * @category constructors
 * @since 2.11.0
 */
var fromOptionK = function (getOption) {
    return function (a) { return _.isSome(getOption(a)); };
};
exports.fromOptionK = fromOptionK;
/**
 * @category constructors
 * @since 2.11.0
 */
var fromEitherK = function (getEither) {
    return function (a) { return _.isRight(getEither(a)); };
};
exports.fromEitherK = fromEitherK;
/**
 * @category constructors
 * @since 2.11.0
 */
var id = function () {
    return function (_) { return true; };
};
exports.id = id;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.11.0
 */
var not = function (refinement) { return function (a) { return !refinement(a); }; };
exports.not = not;
/**
 * @category combinators
 * @since 2.11.0
 */
var or = function (second) { return function (first) { return function (a) { return first(a) || second(a); }; }; };
exports.or = or;
/**
 * @category combinators
 * @since 2.11.0
 */
var and = function (second) { return function (first) { return function (a) { return first(a) && second(a); }; }; };
exports.and = and;
/**
 * @category combinators
 * @since 2.11.0
 */
var zero = function () {
    return function (_) { return false; };
};
exports.zero = zero;
/**
 * @category combinators
 * @since 2.11.0
 */
var compose = function (bc) { return function (ab) {
    return function (i) { return ab(i) && bc(i); };
}; };
exports.compose = compose;
