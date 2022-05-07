import type { Subscription } from 'rxjs'

import DelayQueue from './delay-queue.js'

export interface ExecutionUnit<T = unknown> {
  fn      : () => T,
  name    : string,
  resolve : (value: T | PromiseLike<T>) => void,
  reject  : (e?: any) => void,
}

/**
 * DelayQueueExecutor calls functions one by one with a delay time period between calls.
 */
export class DelayQueueExecutor<T = unknown> extends DelayQueue<ExecutionUnit<T>> {

  private readonly delayQueueSubscription: Subscription

  /**
   *
   * @param period milliseconds
   */
  constructor (
    period: number,
  ) {
    super(period)

    this.delayQueueSubscription = this.subscribe(unit => {
      try {
        const ret = unit.fn()
        return unit.resolve(ret)
      } catch (e) {
        return unit.reject(e)
      }
    })
  }

  async execute (
    fn: () => T,
    name?: string,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const unit: ExecutionUnit<T> = {
        fn,
        name: name || fn.name,
        reject,
        resolve,
      }
      this.next(unit)
    })
  }

  override unsubscribe () {
    this.delayQueueSubscription.unsubscribe()
    super.unsubscribe()
  }

}

export default DelayQueueExecutor
