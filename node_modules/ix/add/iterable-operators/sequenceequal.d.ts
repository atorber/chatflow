import { IterableX } from '../../iterable/iterablex';
import { SequencEqualOptions } from '../../iterable/sequenceequal';
/**
 * @ignore
 */
export declare function sequenceEqualProto<T>(this: IterableX<T>, other: Iterable<T>, options?: SequencEqualOptions<T>): boolean;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        sequenceEqual: typeof sequenceEqualProto;
    }
}
