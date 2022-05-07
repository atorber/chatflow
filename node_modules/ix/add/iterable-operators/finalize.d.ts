import { IterableX } from '../../iterable/iterablex';
import { finalize as _finalize } from '../../iterable/operators/finalize';
/**
 * @ignore
 */
export declare function finalizeProto<T>(this: IterableX<T>, action: () => void): IterableX<T>;
export declare namespace iterable {
    let finalize: typeof _finalize;
}
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        finally: typeof finalizeProto;
    }
}
