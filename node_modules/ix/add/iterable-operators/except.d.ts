import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function exceptProto<T>(this: IterableX<T>, second: Iterable<T>, comparer?: (x: T, y: T) => boolean): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        except: typeof exceptProto;
    }
}
