/**
 * @ignore
 */
export interface RefCount<T> {
    value: T;
    count: number;
}
/**
 * @ignore
 */
export interface IRefCountList<T> {
    clear(): void;
    readonly count: number;
    get(index: number): T;
    push(value: T): void;
    done(): void;
}
/**
 * @ignore
 */
export declare class MaxRefCountList<T> implements IRefCountList<T> {
    private _list;
    clear(): void;
    get count(): number;
    get(index: number): T;
    push(value: T): void;
    done(): void;
}
/**
 * @ignore
 */
export declare class RefCountList<T> implements IRefCountList<T> {
    private _readerCount;
    private _list;
    private _count;
    constructor(readerCount: number);
    clear(): void;
    get count(): number;
    get readerCount(): number;
    set readerCount(value: number);
    done(): void;
    get(index: number): T;
    push(value: T): void;
}
