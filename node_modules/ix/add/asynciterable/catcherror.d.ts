import { catchError as catchErrorStatic } from '../../asynciterable/catcherror';
export declare namespace asynciterable {
    let catchError: typeof catchErrorStatic;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        export { catchErrorStatic as catchError };
    }
}
