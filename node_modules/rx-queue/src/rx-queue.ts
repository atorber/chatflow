import {
  PartialObserver,
  Subject,
  Subscription,
}                   from 'rxjs'

import {
  VERSION,
}             from './config.js'

// default set to 500 milliseconds
const DEFAULT_PERIOD_TIME = 500

// https://codepen.io/maindg/pen/xRwGvL
export class RxQueue<T = unknown> extends Subject<T> {

  private itemList: T[] = []

  constructor (
    public period = DEFAULT_PERIOD_TIME,
  ) {
    super()
  }

  override next (item: T) {
    if (this.observers.length > 0) {
      super.next(item)
    } else {
      this.itemList.push(item)
    }
  }

  override subscribe (observer: PartialObserver<T>)                                                  : Subscription
  override subscribe (next: (value: T) => void, error?: (error: any) => void, complete?: () => void) : Subscription

  override subscribe (...args: never[]): never

  override subscribe (
    nextOrObserver: ((value: T) => void) | PartialObserver<T>,
    error?:         (error: any) => void,
    complete?:      () => void,
  ) {
    let subscription: Subscription // TypeScript strict require strong typing differenciation
    if (typeof nextOrObserver === 'function') {
      subscription = super.subscribe(nextOrObserver, error, complete)
    } else {
      subscription = super.subscribe(nextOrObserver)
    }
    this.itemList.forEach(item => this.next(item))
    this.itemList = []
    return subscription
  }

  public version (): string {
    return VERSION
  }

}

export default RxQueue
