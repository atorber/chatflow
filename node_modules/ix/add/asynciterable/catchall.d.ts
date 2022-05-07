import { catchAll as catchAllStatic } from '../../asynciterable/catcherror';
export declare namespace asynciterable {
    let catchAll: typeof catchAllStatic;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        export { catchAllStatic as catchAll };
    }
}
