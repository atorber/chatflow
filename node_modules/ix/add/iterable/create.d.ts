import { create as createStatic } from '../../iterable/create';
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let create: typeof createStatic;
    }
}
