import { asyncify as asyncifyStatic } from '../../asynciterable/asyncify';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let asyncify: typeof asyncifyStatic;
    }
}
