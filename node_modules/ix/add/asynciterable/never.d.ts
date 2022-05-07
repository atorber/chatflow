import { never as neverStatic } from '../../asynciterable/never';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let never: typeof neverStatic;
    }
}
