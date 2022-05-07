import { Observer, PartialObserver } from '../observer';
export declare function toObserver<T>(next?: PartialObserver<T> | ((value: T) => void) | null, error?: ((err: any) => void) | null, complete?: (() => void) | null): Observer<T>;
