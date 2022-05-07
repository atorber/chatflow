import { generate as generateStatic } from '../../asynciterable/generate';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let generate: typeof generateStatic;
    }
}
