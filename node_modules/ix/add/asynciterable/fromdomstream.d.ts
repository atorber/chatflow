import { fromDOMStream as fromDOMStreamStatic } from '../../asynciterable/fromdomstream';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let fromDOMStream: typeof fromDOMStreamStatic;
    }
}
