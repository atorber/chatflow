import { of as ofStatic } from '../../iterable/of';
export declare namespace iterable {
    let of: typeof ofStatic;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { ofStatic as of };
    }
}
