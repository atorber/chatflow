import { empty as emptyStatic } from '../../iterable/empty';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let empty: typeof emptyStatic;
    }
}
