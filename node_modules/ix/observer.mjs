// Symbol.observable or a string "@@observable". Used for interop.
// Referenced via string indexer so closure-compiler doesn't mangle.
export const observable = (typeof Symbol === 'function' && Symbol.observable) || '@@observable';

//# sourceMappingURL=observer.mjs.map
