import { range as rangeStatic } from '../../iterable/range';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let range: typeof rangeStatic;
    }
}
