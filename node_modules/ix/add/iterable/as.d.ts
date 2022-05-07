import { as as asStatic } from '../../iterable/as';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let as: typeof asStatic;
    }
}
