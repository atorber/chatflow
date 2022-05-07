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
import type { Loggable } from 'brolog'
import { getLoggable }  from 'brolog'
import {
  nop,
  isNop,
}                       from '@pipeletteio/nop'

import {
  VERSION,
}                           from './version.js'
import type {
  StateSwitchInterface,
  StateSwitchOptions,
}                           from './interfaces.js'
import {
  StateSwitchEventEmitter,
  Pending,
  StateType,
}                           from './events.js'

let COUNTER = 0

export class StateSwitch extends StateSwitchEventEmitter implements StateSwitchInterface {

  protected _log: Loggable

  protected _activePromise:   Promise<void>
  protected _inactivePromise: Promise<void>

  protected _activeResolver:    Function
  protected _inactiveResolver:  Function

  protected _isActive   : boolean
  protected _isPending  : boolean

  constructor (
    protected readonly _name = `StateSwitch#${COUNTER++}`,
    protected readonly _options: StateSwitchOptions = {},
  ) {
    super()

    this._log = getLoggable(_options.log)
    this._log.verbose('StateSwitch', 'constructor(%s, "%s")',
      _name,
      JSON.stringify(_options),
    )

    this._isActive   = false
    this._isPending = false

    /**
     * for ready()
     */
    this._activeResolver   = nop
    this._inactiveResolver = nop

    this._activePromise = new Promise<void>(resolve => {
      this._activeResolver = resolve
    })
    this._inactivePromise = Promise.resolve()

  }

  name (): string {
    return this._name
  }

  version (): string {
    return VERSION
  }

  /**
   * Get the current ON state (3VL).
   */
  active (): boolean | Pending
  /**
   * Turn on the current state.
   * @param state
   *  `Pending` means we entered the turn on async process
   *  `true` means we have finished the turn on async process.
   */
  active (state: true | Pending): void

  active (state: never): never
  active (
    state?: true | Pending,
  ): void | boolean | Pending {
    /**
     * Set
     */
    if (state) {
      this._log.verbose('StateSwitch', '<%s> active(%s) <- (%s)',
        this._name,
        state,
        this.active(),
      )

      this._isActive = true
      this._isPending = (state === 'pending')

      this.emit('active', state)

      /**
        * for stable()
        */
      if (isNop(this._inactiveResolver)) {
        this._inactivePromise = new Promise<void>(resolve => (this._inactiveResolver = resolve))
      }
      if (state === true && !isNop(this._activeResolver)) {
        this._activeResolver()
        this._activeResolver = nop
      }

      return
    }

    /**
     * Get
     */
    const activeState = this._isActive
      ? this._isPending ? 'pending' : true
      : false
    this._log.silly('StateSwitch', '<%s> active() is %s', this._name, activeState)
    return activeState
  }

  /**
   * Get the current OFF state (3VL).
   */
  inactive (): boolean | Pending

  /**
   * Turn off the current state.
   * @param state
   *  `Pending` means we entered the turn off async process
   *  `true` means we have finished the turn off async process.
   */
  inactive (state: true | Pending): void

  inactive (state: never): never
  inactive (
    state?: true | Pending,
  ): void | boolean | Pending {
    /**
     * Set
     */
    if (state) {
      this._log.verbose('StateSwitch', '<%s> inactive(%s) <- (%s)',
        this._name,
        state,
        this.inactive(),
      )
      this._isActive  = false
      this._isPending = (state === 'pending')

      this.emit('inactive', state)

      /**
        * for stable()
        */
      if (isNop(this._activeResolver)) {
        this._activePromise = new Promise<void>(resolve => (this._activeResolver = resolve))
      }
      if (state === true && !isNop(this._inactiveResolver)) {
        this._inactiveResolver()
        this._inactiveResolver = nop
      }

      return
    }

    /**
     * Get
     */
    const inactiveState = !this._isActive
      ? this._isPending ? 'pending' : true
      : false
    this._log.silly('StateSwitch', '<%s> inactive() is %s', this._name, inactiveState)
    return inactiveState
  }

  /**
   * does the state is not stable(in process)?
   */
  pending () {
    this._log.silly('StateSwitch', '<%s> pending() is %s', this._name, this._isPending)
    return this._isPending
  }

  /**
   * Wait the pending state to be stable.
   */
  async stable (
    state?: StateType,
    noCross = false,
  ): Promise<void> {
    this._log.verbose('StateSwitch', '<%s> stable(%s, noCross=%s)', this._name, state, noCross)

    if (typeof state === 'undefined') {
      state = this._isActive ? 'active' : 'inactive'
    }

    if (state === 'active') {
      if (this._isActive === false && noCross === true) {
        throw new Error('stable(active) but the state is inactive. call stable(active, false) to disable noCross')
      }

      await this._activePromise

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (state === 'inactive') {
      if (this._isActive === true && noCross === true) {
        throw new Error('stable(inactive) but the state is active. call stable(inactive, false) to disable noCross')
      }
      await this._inactivePromise

    } else {
      throw new Error(`should not go here. ${state} should be of type 'never'`)
    }

    this._log.silly('StateSwitch', '<%s> stable(%s, %s) resolved.', this._name, state, noCross)

  }

}
