import * as _ from './internal';
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
export var fromOptionK = function (getOption) {
    return function (a) { return _.isSome(getOption(a)); };
};
/**
 * @category constructors
 * @since 2.11.0
 */
export var fromEitherK = function (getEither) {
    return function (a) { return _.isRight(getEither(a)); };
};
/**
 * @category constructors
 * @since 2.11.0
 */
export var id = function () {
    return function (_) { return true; };
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.11.0
 */
export var not = function (refinement) { return function (a) { return !refinement(a); }; };
/**
 * @category combinators
 * @since 2.11.0
 */
export var or = function (second) { return function (first) { return function (a) { return first(a) || second(a); }; }; };
/**
 * @category combinators
 * @since 2.11.0
 */
export var and = function (second) { return function (first) { return function (a) { return first(a) && second(a); }; }; };
/**
 * @category combinators
 * @since 2.11.0
 */
export var zero = function () {
    return function (_) { return false; };
};
/**
 * @category combinators
 * @since 2.11.0
 */
export var compose = function (bc) { return function (ab) {
    return function (i) { return ab(i) && bc(i); };
}; };
