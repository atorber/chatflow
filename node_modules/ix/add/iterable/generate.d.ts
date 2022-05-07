import { generate as generateStatic } from '../../iterable/generate';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let generate: typeof generateStatic;
    }
}
