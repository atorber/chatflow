import { repeatValue as _repeatValue } from '../../iterable/repeatvalue';
export declare namespace iterable {
    let repeatStatic: typeof _repeatValue;
}
declare module '../../iterable/iterablex' {
    namespace IterableX {
        let repeatValue: typeof _repeatValue;
    }
}
