import { Subscription } from './subscription';
declare global {
    interface SymbolConstructor {
        readonly observable: symbol;
    }
}
export declare const observable: string | typeof Symbol.observable;
export interface NextObserver<T> {
    next: (value: T) => any;
    error?: (err: any) => any;
    complete?: () => any;
}
export interface ErrorObserver<T> {
    next?: (value: T) => any;
    error: (err: any) => any;
    complete?: () => any;
}
export interface CompletionObserver<T> {
    next?: (value: T) => any;
    error?: (err: any) => any;
    complete: () => any;
}
export declare type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;
export interface NextAsyncObserver<T> {
    next: (value: T) => any | Promise<any>;
    error?: (err: any) => any | Promise<any>;
    complete?: () => any | Promise<any>;
}
export interface ErrorAsyncObserver<T> {
    next?: (value: T) => any | Promise<any>;
    error: (err: any) => any | Promise<any>;
    complete?: () => any | Promise<any>;
}
export interface CompletionAsyncObserver<T> {
    next?: (value: T) => any | Promise<any>;
    error?: (err: any) => any | Promise<any>;
    complete: () => any | Promise<any>;
}
export declare type PartialAsyncObserver<T> = NextAsyncObserver<T> | ErrorAsyncObserver<T> | CompletionAsyncObserver<T>;
export interface Observer<T> {
    closed?: boolean;
    next: (value: T) => void;
    error: (err: any) => void;
    complete: () => void;
}
export interface Observable<T> {
    subscribe(observer?: PartialObserver<T>): Subscription;
    subscribe(next?: null | ((value: T) => void), error?: null | ((error: any) => void), complete?: null | (() => void)): Subscription;
}
