import { MathOptions } from '../../asynciterable/mathoptions';
export declare function averageProto(this: AsyncIterable<number>, options?: MathOptions<number>): Promise<number>;
export declare function averageProto<TSource>(this: AsyncIterable<TSource>, options?: MathOptions<TSource>): Promise<number>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        average: typeof averageProto;
    }
}
