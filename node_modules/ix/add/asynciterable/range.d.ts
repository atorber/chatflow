import { range as rangeStatic } from '../../asynciterable/range';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let range: typeof rangeStatic;
    }
}
