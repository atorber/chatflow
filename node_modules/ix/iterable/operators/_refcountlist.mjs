/**
 * @ignore
 */
export class MaxRefCountList {
    _list = [];
    clear() {
        this._list = [];
    }
    get count() {
        return this._list.length;
    }
    get(index) {
        return this._list[index];
    }
    push(value) {
        this._list.push(value);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    done() { }
}
/**
 * @ignore
 */
export class RefCountList {
    _readerCount;
    _list;
    _count = 0;
    constructor(readerCount) {
        this._readerCount = readerCount;
        this._list = new Map();
    }
    clear() {
        this._list.clear();
    }
    get count() {
        return this._count;
    }
    get readerCount() {
        return this._readerCount;
    }
    set readerCount(value) {
        this._readerCount = value;
    }
    done() {
        this._readerCount--;
    }
    get(index) {
        if (!this._list.has(index)) {
            throw new Error('Element no longer available in the buffer.');
        }
        const res = this._list.get(index);
        const val = res.value;
        if (--res.count === 0) {
            this._list.delete(index);
        }
        return val;
    }
    push(value) {
        this._list.set(this._count++, { value: value, count: this._readerCount });
    }
}

//# sourceMappingURL=_refcountlist.mjs.map
