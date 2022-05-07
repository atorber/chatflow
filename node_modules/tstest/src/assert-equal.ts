/**
 * Convert the `any` type to `unknown for a better safety
 *
 * @return `AnyToUnknown<any> -> unknown`
 *
 *  TODO: huan(202111) need to be tested more and confirm it has no bug in edge cases
 *
 *  @link https://github.com/ReactiveX/rxjs/pull/6669
 */
export type AnyToUnknown<T> = unknown extends T ? unknown : T;

/**
 * Huan(202109): #18 - `dts` package conflict node_modules/.bin/tsc version
 *  https://github.com/huan/sidecar/issues/18
 *
 *  Testing static types in TypeScript
 *    https://2ality.com/2019/07/testing-static-types.html
 */
export type AssertEqual<T, Expected> =
 [AnyToUnknown<T>] extends [Expected]
   ? ([Expected] extends [AnyToUnknown<T>] ? true : never)
   : never
