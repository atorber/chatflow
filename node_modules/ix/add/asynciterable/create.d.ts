import { create as createStatic } from '../../asynciterable/create';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let create: typeof createStatic;
    }
}
