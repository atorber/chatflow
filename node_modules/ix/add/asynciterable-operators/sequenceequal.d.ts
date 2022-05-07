import { SequencEqualOptions } from '../../asynciterable/sequenceequal';
/**
 * @ignore
 */
export declare function sequenceEqualProto<T>(this: AsyncIterable<T>, other: AsyncIterable<T>, options?: SequencEqualOptions<T>): Promise<boolean>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        sequenceEqual: typeof sequenceEqualProto;
    }
}
