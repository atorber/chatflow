import { fromEventPattern as fromEventPatternStatic } from '../../asynciterable/fromeventpattern';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let fromEventPattern: typeof fromEventPatternStatic;
    }
}
