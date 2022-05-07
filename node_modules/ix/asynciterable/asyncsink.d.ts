export declare class AsyncSink<TSource> implements AsyncIterableIterator<TSource> {
    private _ended;
    private _values;
    private _resolvers;
    constructor();
    [Symbol.asyncIterator](): this;
    write(value: TSource): void;
    error(error: any): void;
    private _push;
    next(): Promise<IteratorResult<TSource, any>>;
    end(): void;
}
