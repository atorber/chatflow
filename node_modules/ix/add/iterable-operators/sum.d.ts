import { IterableX } from '../../iterable/iterablex';
import { MathOptions } from '../../iterable/mathoptions';
export declare function sumProto(this: IterableX<number>, options?: MathOptions<number>): number;
export declare function sumProto<T>(this: IterableX<T>, options?: MathOptions<T>): number;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        sum: typeof sumProto;
    }
}
