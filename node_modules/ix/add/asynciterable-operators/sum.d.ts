import { MathOptions } from '../../asynciterable/mathoptions';
export declare function sumProto(this: AsyncIterable<number>, options?: MathOptions<number>): Promise<number>;
export declare function sumProto<T>(this: AsyncIterable<T>, options?: MathOptions<T>): Promise<number>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        sum: typeof sumProto;
    }
}
