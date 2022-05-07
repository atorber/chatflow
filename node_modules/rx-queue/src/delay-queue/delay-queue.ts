import {
  concat,
  of,
  Subject,
  Subscription,
  timer,
}                 from 'rxjs'
import {
  concatMap,
  ignoreElements,
}                 from 'rxjs/operators'

import RxQueue  from '../rx-queue.js'

/**
 * DelayQueue passes all the items and add delays between items.
 * T: item type
 */
export class DelayQueue<T = unknown> extends RxQueue<T> {

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
      concatMap(x => concat(
        of(x),                    // emit first item right away
        /**
         * Issue #71 - DelayQueue failed: behavior breaking change after RxJS from v6 to v7
         *  https://github.com/huan/rx-queue/issues/71
         */
        timer(this.period).pipe(
          ignoreElements(),
        ),
      )),
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

export default DelayQueue
