import { IterableX } from '../../iterable/iterablex';
import { MathOptions } from '../../iterable/mathoptions';
export declare function averageProto(this: IterableX<number>, options?: MathOptions<number>): number;
export declare function averageProto<T>(this: IterableX<T>, options?: MathOptions<T>): number;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        average: typeof averageProto;
    }
}
