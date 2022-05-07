import { merge as mergeStatic } from '../../asynciterable/merge';
declare module '../../asynciterable/asynciterablex' {
    namespace AsyncIterableX {
        let merge: typeof mergeStatic;
    }
}
