import { empty as emptyStatic } from '../../asynciterable/empty';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let empty: typeof emptyStatic;
    }
}
