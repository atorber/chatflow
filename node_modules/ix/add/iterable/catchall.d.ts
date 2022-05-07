import { catchAll as _catchAll } from '../../iterable/catcherror';
export declare namespace iterable {
    let catchAll: typeof _catchAll;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { _catchAll as catchAll };
    }
}
