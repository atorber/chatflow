import { iif as ifStatic } from '../../iterable/iif';
export declare namespace iterable {
    let iif: typeof ifStatic;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { ifStatic as iif };
    }
}
