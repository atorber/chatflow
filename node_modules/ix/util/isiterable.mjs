/* eslint-disable @typescript-eslint/ban-types */
/** @ignore */
const isNumber = (x) => typeof x === 'number';
/** @ignore */
const isBoolean = (x) => typeof x === 'boolean';
/** @ignore */
export const isFunction = (x) => typeof x === 'function';
/** @ignore */
export const isObject = (x) => x != null && Object(x) === x;
/** @ignore */
export const isPromise = (x) => {
    return isObject(x) && isFunction(x.then);
};
/** @ignore */
export function isArrayLike(x) {
    return isObject(x) && isNumber(x['length']);
}
/** @ignore */
export function isIterable(x) {
    return x != null && isFunction(x[Symbol.iterator]);
}
/** @ignore */
export function isIterator(x) {
    return isObject(x) && !isFunction(x[Symbol.iterator]) && isFunction(x['next']);
}
/** @ignore */
export function isAsyncIterable(x) {
    return isObject(x) && isFunction(x[Symbol.asyncIterator]);
}
/** @ignore */
export function isObservable(x) {
    return x != null && Object(x) === x && typeof x['subscribe'] === 'function';
}
/** @ignore */
export const isReadableNodeStream = (x) => {
    return (isObject(x) &&
        isFunction(x['pipe']) &&
        isFunction(x['_read']) &&
        isBoolean(x['readable']) &&
        isObject(x['_readableState']));
};
/** @ignore */
export const isWritableNodeStream = (x) => {
    return (isObject(x) &&
        isFunction(x['end']) &&
        isFunction(x['_write']) &&
        isBoolean(x['writable']) &&
        isObject(x['_writableState']));
};
/** @ignore */
export const isReadableDOMStream = (x) => {
    return isObject(x) && isFunction(x['cancel']) && isFunction(x['getReader']);
};
/** @ignore */
export const isWritableDOMStream = (x) => {
    return isObject(x) && isFunction(x['abort']) && isFunction(x['getWriter']);
};
/** @ignore */
export const isFetchResponse = (x) => {
    return isObject(x) && isReadableDOMStream(x['body']);
};

//# sourceMappingURL=isiterable.mjs.map
