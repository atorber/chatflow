import { fromNodeStream as fromNodeStreamStatic } from '../../asynciterable/fromnodestream';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let fromNodeStream: typeof fromNodeStreamStatic;
    }
}
