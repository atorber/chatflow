import {
  interval,
  Subject,
  Subscription,
}                 from 'rxjs'
import {
  debounce,
}                 from 'rxjs/operators'

import RxQueue  from '../rx-queue.js'

/**
 * DebounceQueue drops a item if there's another one comes in a period of time.
 *
 * T: item type
 */
export class DebounceQueue<T = unknown> extends RxQueue<T> {

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
      debounce(() => interval(this.period)),
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

export default DebounceQueue
