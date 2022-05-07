import { whileDo as _whileDo } from '../../asynciterable/whiledo';
export declare namespace asynciterable {
    let whileDo: typeof _whileDo;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        export { _whileDo as whileDo };
    }
}
