/**
 * Wrap promise in sync way (catch error by emitting it)
 *  1. convert a async callback function to be sync function
 *    by catcing any errors and emit them to error event
 *  2. wrap a Promise by catcing any errors and emit them to error event
 */
interface WrapAsync {

  (promise: Promise<any>): void

  <T extends (...args: any[]) => Promise<any>> (
    asyncFunction: T,
  ): (...args: Parameters<T>) => void

}

type WrapAsyncErrorCallback = (error: any) => void
type WrapAsyncError = (onError: WrapAsyncErrorCallback) => WrapAsync

const wrapAsyncError: WrapAsyncError = onError => <T extends (...args: any[]) => any | Promise<any>> (
  asyncStaff: T | Promise<any>,
) => {
  /**
   * 1. Promise
   */
  if (asyncStaff instanceof Promise) {
    asyncStaff
      .then(_ => _)
      .catch(e => onError(e))
    /**
     * Huan(202110) FIXME:
     *  The same code works inside the Wechaty/Puppet class
     *  but here we  have to use `as any` to bypass the type check
     */
    return undefined as any
  }

  /**
   * 2. Function
   *  pay attention to `this` because we need to pass it down.
   */
  return function (this: any, ...args: Parameters<T>): void {
    try {
      const ret = asyncStaff.apply(this, args)
      if (ret instanceof Promise) {
        ret.catch(onError)
      } else {
        void ret  // <- Huan(202110): to see what type it is
      }
    } catch (e) {
      onError(e)
    }
  }
}

export type {
  WrapAsync,
  WrapAsyncErrorCallback,
}
export {
  wrapAsyncError,
}
