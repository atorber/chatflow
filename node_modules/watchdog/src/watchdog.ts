// https://github.com/andrew-filonenko/ya-watchdog
// https://en.wikipedia.org/wiki/Watchdog_timer

import { EventEmitter } from 'events'

import { log }  from 'brolog'

import { VERSION } from './version.js'

interface WatchdogFood<T = any, D = any> {
  data                 : D,
  timeoutMilliseconds? : number,
  type?                : T
}

type WatchdogEvent       = 'feed' | 'reset' | 'sleep'
type WatchdogListener<T, D> = (food: WatchdogFood<T, D>, time: number) => void

class Watchdog<T = any, D = any> extends EventEmitter {

  static VERSION = VERSION

  private timer : ReturnType<typeof setTimeout> | undefined | null  // `undefined` stands for the first time init. `null` will be set by `stopTimer`

  private lastFeed? : number
  private lastFood? : WatchdogFood<T, D>

  /**
   * A Timer used to detect and recover from malfunctions
   *
   * @class Watchdog
   * @param {number} [defaultTimeoutMilliseconds=60 * 1000]
   * @param {string} [name='Bark']
   * @example
   * const TIMEOUT = 1 * 1000  // 1 second
   * const dog = new watchdog(TIMEOUT)
   *
   * const food = { data: 'delicious' }
   *
   * dog.on('reset', () => console.log('reset-ed'))
   * dog.on('feed',  () => console.log('feed-ed'))
   *
   * dog.feed(food)
   * // Output: feed-ed
   *
   * setTimeout(function() {
   *   dog.sleep()
   *   console.log('dog sleep-ed. Demo over.')
   * }, TIMEOUT + 1)
   * // Output: reset-ed.
   * // Output: dog sleep-ed. Demo over.
   *
   */
  constructor (
    public defaultTimeoutMilliseconds = 60 * 1000,
    public name = 'Bark',
  ) {
    super()
    log.verbose('Watchdog', '<%s>: constructor(name=%s, defaultTimeout=%d)', name, name, defaultTimeoutMilliseconds)
  }

  version (): string {
    return VERSION
  }

  override on (event: 'feed',  listener: WatchdogListener<T, D>) : this
  override on (event: 'reset', listener: WatchdogListener<T, D>) : this
  override on (event: 'sleep', listener: WatchdogListener<T, D>) : this
  override on (event: never,   listener: never)            : never

  /**
   * @desc       Watchdog Class Event Type
   * @typedef    WatchdogEvent
   * @property   { string }  feed  - Emit when feed the dog.
   * @property   { string }  reset - Emit when timeout and reset.
   * @property   { string }  sleep - Emit when timer is cleared out.
   */

  /**
   * @desc       Watchdog Class Event Function
   * @typedef    WatchdogListener
   * @property   { Function }   - (food: WatchdogFood<T, D>, left: number) => void
   */

  /**
   * @listens Watchdog
   * @param   { WatchdogEvent }           event
   * @param   { WatchdogListener<T, D> }  listener
   * @returns { this }
   *
   * @example <caption>Event:reset </caption>
   * dog.on('reset', () => console.log('reset-ed'))
   * @example <caption>Event:feed </caption>
   * dog.on('feed',  () => console.log('feed-ed'))
   * @example <caption>Event:sleep </caption>
   * dog.on('sleep',  () => console.log('sleep-ed'))
   *
   */
  override on (event: WatchdogEvent, listener: WatchdogListener<T, D>): this {
    log.verbose('Watchdog', '<%s> on(%s, listener) registered.', this.name, event)
    super.on(event, listener)
    return this
  }

  private startTimer (timeout: number): void {
    log.verbose('Watchdog', '<%s> startTimer()', this.name)

    if (this.timer) {
      throw new Error('timer already exist!')
    }

    this.timer = setTimeout(() => {
      log.verbose('Watchdog', '<%s> startTimer() setTimeout() after %d', this.name, timeout)
      this.timer = undefined  // sleep after reset
      this.emit(
        'reset',
        this.lastFood,
        (this.lastFood && this.lastFood.timeoutMilliseconds) || this.defaultTimeoutMilliseconds,
      )
    }, timeout)

    // https://github.com/huan/watchdog/issues/31
    if (typeof this.timer['unref'] === 'function') {
      this.timer.unref()  // should not block node quit
    }
  }

  private stopTimer (sleep = false): void {
    log.verbose('Watchdog', '<%s> stopTimer()', this.name)

    if (typeof this.timer === 'undefined') {  // first time
      log.verbose('Watchdog', '<%s> stopTimer() first run(or after sleep)', this.name)
      return
    }

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    } else if (!sleep) {
      throw new Error('timer is already stoped!')
    }
  }

  /**
   * Get the left time
   * @returns {number}
   */
  left (): number {
    let left
    if (typeof this.lastFeed !== 'undefined'
        && Number.isInteger(this.lastFeed)
    ) {
      // console.log('lastFeed=', this.lastFeed)
      // console.log('timeout=', this.lastFood.timeout)
      // console.log('Date.now()=', Date.now())
      left = this.lastFeed + this.defaultTimeoutMilliseconds - Date.now()
      log.verbose('Watchdog', '<%s> timerLeft() = %d', this.name, left)
    } else {
      left = 0
      log.verbose('Watchdog', '<%s> timerLeft() first feed, left=%s', this.name, left)
    }
    return left
  }

  /**
   * Dog Feed content
   *
   * @typedef    WatchdogFood
   * @property   {D}      data     - feed content.
   * @property   {number} timeout  - option, set timeout.
   * @property   {T}      type     - option.
   */

  /**
   * feed the dog
   * @param {WatchdogFood} food
   * @returns {number}
   * @example
   * const food = {
   *   data:    'delicious',
   *   timeout: 1 * 1000,
   * }
   * const dog = new Watchdog()
   * dog.feed(food)
   */
  feed (food: WatchdogFood<T, D>): number {

    // JSON.stringify, avoid TypeError: Converting circular structure to JSON
    // https://stackoverflow.com/a/11616993/1123955
    function replacerFactory () {
      // Note: cache should not be re-used by repeated calls to JSON.stringify.
      const cache: any[] = []
      return function (_: any, value: any) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return
          }
          // Store value in our collection
          cache.push(value)
        }
        return value
      }
    }

    log.verbose('Watchdog', '<%s> feed(%s)', this.name, JSON.stringify(food, replacerFactory()))

    if (typeof food !== 'object') {
      /**
       * weak typing compatible:
       *  if user call watchdog.feed('string'), we need to pre-process the food to a object.
       *  or we will meet a exception: we can not set property on string type.
       */
      food = {
        data: food,
      }
    }

    if (!food.timeoutMilliseconds) {
      food.timeoutMilliseconds = this.defaultTimeoutMilliseconds
    }

    const left = this.left()

    this.stopTimer()
    this.startTimer(food.timeoutMilliseconds)

    this.lastFeed = Date.now()
    this.lastFood = food

    this.emit('feed', food, left)

    return left
  }

  /**
   * Clear timer.
   * @example
   * const dog = new Watchdog()
   * dog.sleep()
   */
  sleep (): void {
    log.verbose('Watchdog', '<%s> sleep()', this.name)
    this.stopTimer(true)
    this.timer = undefined
    this.emit('sleep', this.lastFood, this.left())
  }

  /**
   *
   */
  unref (): void {
    log.verbose('Watchdog', '<%s> unref()', this.name)
    if (this.timer) {
      // https://github.com/huan/watchdog/issues/31
      if (typeof this.timer['unref'] === 'function') {
        this.timer.unref()  // should not block node quit
      }
    }
  }

}

export type {
  WatchdogFood,
}
export {
  Watchdog,
}
