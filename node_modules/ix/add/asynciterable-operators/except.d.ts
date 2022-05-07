import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function exceptProto<T>(this: AsyncIterableX<T>, second: AsyncIterable<T>, comparer?: (x: T, y: T) => boolean | Promise<boolean>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        except: typeof exceptProto;
    }
}
