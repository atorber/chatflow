export declare class AbortError extends Error {
    constructor(message?: string);
    get [Symbol.toStringTag](): string;
}
export declare function throwIfAborted(signal?: AbortSignal): void;
