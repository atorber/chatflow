var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
export var isNone = function (fa) { return fa._tag === 'None'; };
/** @internal */
export var isSome = function (fa) { return fa._tag === 'Some'; };
/** @internal */
export var none = { _tag: 'None' };
/** @internal */
export var some = function (a) { return ({ _tag: 'Some', value: a }); };
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
export var isLeft = function (ma) { return ma._tag === 'Left'; };
/** @internal */
export var isRight = function (ma) { return ma._tag === 'Right'; };
/** @internal */
export var left = function (e) { return ({ _tag: 'Left', left: e }); };
/** @internal */
export var right = function (a) { return ({ _tag: 'Right', right: a }); };
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
export var singleton = function (a) { return [a]; };
/** @internal */
export var isNonEmpty = function (as) { return as.length > 0; };
/** @internal */
export var head = function (as) { return as[0]; };
/** @internal */
export var tail = function (as) { return as.slice(1); };
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
export var emptyReadonlyArray = [];
/** @internal */
export var emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
export var has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
export var fromReadonlyNonEmptyArray = function (as) { return __spreadArray([as[0]], as.slice(1)); };
