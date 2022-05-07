import { defer as deferStatic } from '../../iterable/defer';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let defer: typeof deferStatic;
    }
}
