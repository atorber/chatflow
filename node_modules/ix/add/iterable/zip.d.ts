import { zip as zipStatic } from '../../iterable/zip';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let zip: typeof zipStatic;
    }
}
