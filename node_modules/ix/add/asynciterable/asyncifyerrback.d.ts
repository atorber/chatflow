import { asyncifyErrback as asyncifyErrbackStatic } from '../../asynciterable/asyncifyerrback';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let asyncifyErrback: typeof asyncifyErrbackStatic;
    }
}
