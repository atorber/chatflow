import { defer as deferStatic } from '../../asynciterable/defer';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let defer: typeof deferStatic;
    }
}
