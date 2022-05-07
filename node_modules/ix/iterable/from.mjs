import { identity } from '../util/identity';
import { bindCallback } from '../util/bindcallback';
import { isIterable, isArrayLike, isIterator } from '../util/isiterable';
import { toLength } from '../util/tolength';
/** @nocollapse */
export let from;
/** @nocollapse */
export let FromIterable;
export function _initialize(Ctor) {
    /** @nocollapse */
    from = function (source, selector = identity, thisArg) {
        const fn = bindCallback(selector, thisArg, 2);
        if (isIterable(source)) {
            return new FromIterable(source, fn);
        }
        if (isArrayLike(source)) {
            return new FromIterable(source, fn);
        }
        if (isIterator(source)) {
            return new FromIterable({ [Symbol.iterator]: () => source }, fn);
        }
        throw new TypeError('Input type not supported');
    };
    // eslint-disable-next-line no-shadow
    FromIterable = class FromIterable extends Ctor {
        _source;
        _fn;
        constructor(source, fn) {
            super();
            this._source = source;
            this._fn = fn;
        }
        *[Symbol.iterator]() {
            const iterable = isIterable(this._source);
            let i = 0;
            if (iterable) {
                for (const item of this._source) {
                    yield this._fn(item, i++);
                }
            }
            else {
                const length = toLength(this._source.length);
                while (i < length) {
                    const val = this._source[i];
                    yield this._fn(val, i++);
                }
            }
        }
    };
}

//# sourceMappingURL=from.mjs.map
