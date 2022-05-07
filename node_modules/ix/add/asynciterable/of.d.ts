import { of as ofStatic } from '../../asynciterable/of';
export declare namespace asynciterable {
    let of: typeof ofStatic;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        export { ofStatic as of };
    }
}
