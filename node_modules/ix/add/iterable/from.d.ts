import { from as fromStatic } from '../../iterable/from';
export declare namespace iterable {
    let from: typeof fromStatic;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { fromStatic as from };
    }
}
