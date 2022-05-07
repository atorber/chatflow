/**
 * Licenst: Apache-2.0
 * https://github.com/huan/state-switch
 */
import { getLoggable }    from 'brolog'
import type { Loggable }  from 'brolog'
import { timeoutPromise } from 'gerror'

import {
  ServiceCtlInterface,
  StateSwitchOptions,
  ServiceableAbstract,
  StateSwitchInterface,
}                               from '../interfaces.js'
import { StateSwitch }          from '../state-switch.js'
import { BusyIndicator }        from '../busy-indicator.js'
import { VERSION }              from '../version.js'

/**
 * Wait from unknown state
 */
const TIMEOUT_SECONDS = 5
const RESET_TIMEOUT_SECONDS = TIMEOUT_SECONDS * 3

const serviceCtlMixin = (
  serviceCtlName = 'ServiceCtl',
  options? : StateSwitchOptions,
) => <SuperClass extends typeof ServiceableAbstract> (superClass: SuperClass) => {

  abstract class ServiceCtlMixin extends superClass implements ServiceCtlInterface {

    static VERSION = VERSION

    state: StateSwitchInterface

    __serviceCtlResettingIndicator : BusyIndicator
    __serviceCtlLogger                : Loggable

    constructor (...args: any[]) {
      super(...args)

      this.__serviceCtlLogger = getLoggable(options?.log)
      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'constructor()')

      this.state = new StateSwitch(serviceCtlName, options)
      this.__serviceCtlResettingIndicator = new BusyIndicator(serviceCtlName + 'Reset', options)
    }

    override async start () : Promise<void> {
      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'start()')

      if (this.state.active()) {
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'start() found that is starting/statred ...')
        await this.state.stable('active')
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'start() found that is starting/statred ... done')
        return
      }

      if (this.state.inactive() === 'pending') {
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'start() found that is stopping, waiting stable ... (max %s seconds)', TIMEOUT_SECONDS)
        try {
          await timeoutPromise(
            this.state.stable('inactive'),
            TIMEOUT_SECONDS * 1000,
          )
          this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'start() found that is stopping, waiting stable ... done')
        } catch (e) {
          this.emit('error', e)
          this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'start() found that is stopping, waiting stable ... timeout')
        }
      }

      this.state.active('pending')

      try {
        /**
         * Parent start()
         */
        if (typeof super.start === 'function') {
          this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'start() super.start() ...')
          await super.start()
          this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'start() super.start() ... done')
        }

        /**
         * Child onStart()
         */
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'start() this.onStart() ...')
        await this.onStart()
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'start() this.onStart() ... done')

        /**
         * the service has been successfully started
         */
        this.state.active(true)

      } catch (e) {
        this.emit('error', e)
        await this.stop()
        throw e
      }

      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'start() ... done')
    }

    override async stop (): Promise<void> {
      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'stop()')

      /**
       * Already in inactive/stop state: return directly
       */
      if (this.state.inactive()) {
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'stop() found that is stopping/stopped, wait stable ...')
        await this.state.stable('inactive')
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'stop() found that is stopping/stopped, wait stable ... done')
        return
      }

      /**
       * activing/starting: wait it to be finished first (with timeout)
       */
      if (this.state.active() === 'pending') {
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'stop() found that is starting...')

        try {
          this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'stop() found that is starting, waiting stable ... (max %s seconds)', TIMEOUT_SECONDS)
          await timeoutPromise(
            this.state.stable('active'),
            TIMEOUT_SECONDS * 1000,
          )
          this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'stop() found that is starting, waiting stable ... done')
        } catch (e) {
          this.emit('error', e)
          this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'stop() found that is starting, waiting stable ... timeout')
        }
      }

      this.state.inactive('pending')

      /**
       * Child onStop()
       */
      try {
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'stop() this.onStop() ...')
        await this.onStop()
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'stop() this.onStop() ... done')

      } catch (e) {
        this.emit('error', e)
      }

      /**
       * Parent stop()
       */
      if (typeof super.stop === 'function') {
        try {
          this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'stop() super.stop() ...')
          await super.stop()
          this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'stop() super.stop() ... done')
        } catch (e) {
          this.emit('error', e)
        }
      }

      /**
       * no matter whether the `try {...}` code success or not
       *  set the service state to off(stopped) state
       */
      this.state.inactive(true)

      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'stop() ... done')
    }

    async reset (): Promise<void> {
      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset()')

      /**
       * Do not reset again if it's already resetting
       */
      if (this.__serviceCtlResettingIndicator.busy()) {
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() `resetBusy` is `busy`, wait `idle()` (max %d seconds) ...', RESET_TIMEOUT_SECONDS)
        try {
          await timeoutPromise(
            this.__serviceCtlResettingIndicator.idle(),
            RESET_TIMEOUT_SECONDS * 1000,
            () => new Error('wait resetting timeout'),
          )
          this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() `resetBusy` is `busy`, wait `idle()` (max %d seconds) ... done', RESET_TIMEOUT_SECONDS)

          return

        } catch (e) {
          this.emit('error', e)
          this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() `resetBusy` is `busy`, wait `idle()` (max %d seconds) ... timeout')
        }
      }

      /**
       * Do not start Service if the stable state is OFF
       */
      if (this.state.inactive()) {
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() `state` is `off`, do nothing')
        return
      }

      this.__serviceCtlResettingIndicator.busy(true)

      /**
       * If the Service is starting/stopping, wait for it
       * The state will be `'active'` after await `stable()`
       */
      try {
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() wait state ready() ...')
        await timeoutPromise(
          this.state.stable(),
          3 * TIMEOUT_SECONDS * 1000,
          () => new Error('state.ready() timeout'),
        )
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() wait state ready() ... done')
      } catch (e) {
        this.emit('error', e)
        this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() wait state ready() ... timeout')
      }

      /**
       * Do the stop() & start() job
       */
      try {
        await this.stop()
        await this.start()
      } catch (e) {
        this.emit('error', e)
        this.__serviceCtlLogger.warn(`ServiceCtl<${serviceCtlName}>`, 'reset() ... rejection: %s', (e as Error).message)

      } finally {
        this.__serviceCtlResettingIndicator.busy(false)
      }

      this.__serviceCtlLogger.verbose(`ServiceCtl<${serviceCtlName}>`, 'reset() ... done')
    }

    /**
     * onStart & onStop must be implemented by the child class
     */
    abstract onStart (): Promise<void>
    abstract onStop  (): Promise<void>

  }

  return ServiceCtlMixin
}

abstract class ServiceCtl extends serviceCtlMixin()(ServiceableAbstract) {}

export {
  ServiceCtl,
  serviceCtlMixin,
}
