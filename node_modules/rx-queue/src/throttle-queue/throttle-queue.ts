import {
  interval,
  Subject,
  Subscription,
}                 from 'rxjs'
import {
  throttle,
}                 from 'rxjs/operators'

import RxQueue  from '../rx-queue.js'

/**
 * ThrottleQueue
 *
 * passes one item and then drop all the following items in a period of time.
 *
 * T: item type
 */
export class ThrottleQueue<T = unknown> extends RxQueue<T> {

  private subscription : Subscription
  private subject      : Subject<T>

  /**
   *
   * @param period milliseconds
   */
  constructor (
    period?: number, // milliseconds
  ) {
    super(period)

    this.subject      = new Subject<T>()
    this.subscription = this.subject.pipe(
      throttle(() => interval(this.period)),
    ).subscribe((item: T) => super.next(item))
  }

  override next (item: T) {
    this.subject.next(item)
  }

  override unsubscribe () {
    this.subscription.unsubscribe()
    super.unsubscribe()
  }

}

export default ThrottleQueue
