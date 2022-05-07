import { concat as concatStatic } from '../../iterable/concat';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let concat: typeof concatStatic;
    }
}
