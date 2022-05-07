/**
 * @ignore
 */
export declare function arrayIndexOf<T>(array: T[], item: T, comparer: (a: T, b: T) => boolean): number;
/**
 * @ignore
 */
export declare function arrayIndexOfAsync<T>(array: T[], item: T, comparer: (a: T, b: T) => boolean | Promise<boolean>): Promise<number>;
