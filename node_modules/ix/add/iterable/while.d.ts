import { whileDo as whileDoStatic } from '../../iterable/whiledo';
export declare namespace iterable {
    let whileDo: typeof whileDoStatic;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        export { whileDoStatic as whileDo };
    }
}
