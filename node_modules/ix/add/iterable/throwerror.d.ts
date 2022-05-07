import { throwError as throwErrorStatic } from '../../iterable/throwerror';
export declare namespace iterable {
    let throwError: typeof throwErrorStatic;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { throwErrorStatic as throwError };
    }
}
