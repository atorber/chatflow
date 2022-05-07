import { fromEvent as fromEventStatic } from '../../asynciterable/fromevent';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let fromEvent: typeof fromEventStatic;
    }
}
