import { onErrorResumeNext as onErrorResumeNextStatic } from '../../iterable/onerrorresumenext';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let onErrorResumeNext: typeof onErrorResumeNextStatic;
    }
}
