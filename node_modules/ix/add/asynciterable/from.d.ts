import { from as fromStatic } from '../../asynciterable/from';
export declare namespace asynciterable {
    let from: typeof fromStatic;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        export { fromStatic as from };
    }
}
