import { race as raceStatic } from '../../asynciterable/race';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let race: typeof raceStatic;
    }
}
