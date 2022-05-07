import { forkJoin as forkJoinStatic } from '../../asynciterable/forkjoin';
export declare namespace asynciterable {
    let forkJoin: typeof forkJoinStatic;
}
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let forkJoin: typeof forkJoinStatic;
    }
}
