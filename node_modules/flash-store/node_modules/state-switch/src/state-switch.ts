/**
 *
 * StateSwitch for easy managing the states with async programming
 *
 * Class StateSwitch
 * Licenst: Apache-2.0
 * https://github.com/huan/state-switch
 *
 * Helper Class for Manage State Change
 */
import { EventEmitter } from 'events'

import NOP from 'nop'

import { VERSION } from './version'

/**
 * Using Three Valued Logic for ON/OFF State
 *  https://github.com/huan/state-switch/issues/1
 *
 * Three-valued Logic (3VL): `true`, `false`, and
 *  'pending': it's in process, not stable.
 */
type Pending = 'pending'

interface StateSwitchOptions {
  log?: any // Brolog or Npmlog instance
}

let COUNTER = 0

export class StateSwitch extends EventEmitter {

  private log: any

  private onPromise:    Promise<void>
  private offPromise:   Promise<void>

  private onResolver:   Function
  private offResolver:  Function

  private _onoff   : boolean
  private _pending : boolean

  /**
   * does the state is not stable(in process)?
   */
  public get pending () {
    this.log.silly('StateSwitch', '<%s> pending() is %s', this.name, this._pending)
    return this._pending
  }

  constructor (
    public readonly name = `#${COUNTER++}`,
    public readonly options: StateSwitchOptions = {},
  ) {
    super()

    if (options.log) {
      this.setLog(options.log)
    } else {
      this.setLog(null)
    }
    this.log.verbose('StateSwitch', 'constructor(%s, "%s")',
      name,
      JSON.stringify(options),
    )

    this._onoff   = false
    this._pending = false

    /**
     * for ready()
     */
    this.offPromise = Promise.resolve()
    this.onPromise  = new Promise<void>(resolve => {
      this.onResolver = resolve
    })
    this.offResolver = NOP

  }

  public version (): string {
    return VERSION
  }

  public setLog (logInstance?: any) {
    if (logInstance) {
      this.log = logInstance
    } else {
      /* eslint @typescript-eslint/no-unused-vars: off */
      this.log = {
        error   : NOP,
        silly   : NOP,
        verbose : NOP,
        warn    : NOP,
      }
    }
  }

  /**
   * Get the current ON state (3VL).
   */
  public on (): boolean | Pending
  /**
   * Turn on the current state.
   * @param state
   *  `Pending` means we entered the turn on async process
   *  `true` means we have finished the turn on async process.
   */
  public on (state: true | Pending): void

  public on (state: never): never
  public on (
    state?: true | Pending,
  ): void | boolean | Pending {
    /**
     * Set
     */
    if (state) {
      this.log.verbose('StateSwitch', '<%s> on(%s) <- (%s)',
        this.name,
        state,
        this.on(),
      )

      this._onoff = true
      this._pending = (state === 'pending')

      this.emit('on', state)

      /**
        * for ready()
        */
      if (this.offResolver === NOP) {
        this.offPromise = new Promise<void>(resolve => (this.offResolver = resolve))
      }
      if (state === true && this.onResolver !== NOP) {
        this.onResolver()
        this.onResolver = NOP
      }

      return
    }

    /**
     * Get
     */
    const on = this._onoff
      ? this._pending
        ? 'pending'
        : true
      : false
    this.log.silly('StateSwitch', '<%s> on() is %s', this.name, on)
    return on
  }

  /**
   * Get the current OFF state (3VL).
   */
  public off (): boolean | Pending

  /**
   * Turn off the current state.
   * @param state
   *  `Pending` means we entered the turn off async process
   *  `true` means we have finished the turn off async process.
   */
  public off (state: true | Pending): void

  public off (state: never): never
  public off (
    state?: true | Pending,
  ): void | boolean | Pending {
    /**
     * Set
     */
    if (state) {
      this.log.verbose('StateSwitch', '<%s> off(%s) <- (%s)',
        this.name,
        state,
        this.off(),
      )
      this._onoff      = false
      this._pending = (state === 'pending')

      this.emit('off', state)

      /**
        * for ready()
        */
      if (this.onResolver === NOP) {
        this.onPromise = new Promise<void>(resolve => (this.onResolver = resolve))
      }
      if (state === true && this.offResolver !== NOP) {
        this.offResolver()
        this.offResolver = NOP
      }

      return
    }

    /**
     * Get
     */
    const off = !this._onoff
      ? this._pending ? 'pending' : true
      : false
    this.log.silly('StateSwitch', '<%s> off() is %s', this.name, off)
    return off
  }

  public async ready (
    state: 'on' | 'off' = 'on',
    noCross             = false,
  ): Promise<void> {
    this.log.verbose('StateSwitch', '<%s> ready(%s, noCross=%s)', this.name, state, noCross)

    if (state === 'on') {
      if (this._onoff === false && noCross === true) {
        throw new Error('ready(on) but the state is off. call ready(on, false) to disable noCross')
      }

      await this.onPromise

    } else if (state === 'off') {
      if (this._onoff === true && noCross === true) {
        throw new Error('ready(off) but the state is on. call ready(off, false) to disable noCross')
      }
      await this.offPromise

    } else {
      throw new Error(`should not go here. ${state} should be of type 'never'`)
    }

    this.log.silly('StateSwitch', '<%s> ready(%s, %s) resolved.', this.name, state, noCross)

  }

  /**
   * Huan(202105): To make RxJS fromEvent happy: type inferencing
   *  https://github.com/ReactiveX/rxjs/blob/92fbdda7c06561bc73dae3c14de3fc7aff92bbd4/src/internal/observable/fromEvent.ts#L39-L50
   */
  public addEventListener (
    event: 'on' | 'off',
    listener: ((payload: true | 'pending') => void),
  ): void {
    if (listener) {
      super.addListener(event, listener)
    }
  }

  removeEventListener (
    event: string,
    listener: ((payload: true | 'pending') => void),
  ): void {
    if (listener) {
      super.removeListener(event, listener)
    }
  }

}
