import { iif as ifStatic } from '../../asynciterable/iif';
export declare namespace asynciterable {
    let iif: typeof ifStatic;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        export { ifStatic as iif };
    }
}
