import { catchError as _catchError } from '../../iterable/catcherror';
export declare namespace iterable {
    let catchError: typeof _catchError;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { _catchError as catchError };
    }
}
