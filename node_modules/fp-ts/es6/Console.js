/**
 * @since 2.0.0
 */
export var log = function (a) { return function () { return console.log(a); }; }; // tslint:disable-line:no-console
/**
 * @since 2.0.0
 */
export var warn = function (a) { return function () { return console.warn(a); }; }; // tslint:disable-line:no-console
/**
 * @since 2.0.0
 */
export var error = function (a) { return function () { return console.error(a); }; }; // tslint:disable-line:no-console
/**
 * @since 2.0.0
 */
export var info = function (a) { return function () { return console.info(a); }; }; // tslint:disable-line:no-console
