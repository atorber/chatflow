import { generateTime as generateTimeStatic } from '../../asynciterable/generatetime';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let generateTime: typeof generateTimeStatic;
    }
}
