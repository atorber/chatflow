/**
 * Licenst: Apache-2.0
 * https://github.com/huan/state-switch
 */
import {
  createMachine,
  interpret,
  Interpreter,
}                       from 'xstate'

import { VERSION }              from '../version.js'
import {
  ServiceableAbstract,
  ServiceCtlInterface,
  StateSwitchInterface,
  StateSwitchOptions,
}                             from '../interfaces.js'

import type {
  ServiceCtlContext,
  ServiceCtlEvent,
  ServiceCtlState,
}                     from './machine-config.js'
import {
  config,
}                     from './machine-config.js'

import { buildMachineOptions }  from './machine-options.js'
import { waitForMachineState }  from './wait-for-selector.js'
import { guardMachineEvent }    from './guard-machine-event.js'
import { getLoggable } from 'brolog'
import type { Loggable } from 'brolog'
import { StateSwitch } from '../state-switch.js'

const serviceCtlFsmMixin = (
  serviceCtlName = 'ServiceCtlFsm',
  options? : StateSwitchOptions,
) => <SuperClass extends typeof ServiceableAbstract> (superClass: SuperClass) => {

  abstract class ServiceCtlFsmMixin extends superClass implements ServiceCtlInterface {

    static VERSION = VERSION

    /**
     * Huan(202110): this state is simple record the start/stop status
     */
    state: StateSwitchInterface

    __serviceCtlLogger: Loggable
    __serviceCtlFsmInterpreter: Interpreter<
      ServiceCtlContext,
      ServiceCtlState,
      ServiceCtlEvent
    >

    constructor (...args: any[]) {
      super(...args)

      this.__serviceCtlLogger = getLoggable(options?.log)
      this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'constructor()')

      this.state = new StateSwitch(serviceCtlName, options)

      const machineOptions = buildMachineOptions({
        // reset: () => has been internally implemented by calling stop() and start()
        start: async () => {
          if (typeof super.start === 'function') {
            await super.start()
          }
          await this.onStart()
        },
        stop: async () => {
          await this.onStop()
          if (typeof super.stop === 'function') {
            await super.stop()
          }
        },
      })
      const machine = createMachine(config, machineOptions)

      this.__serviceCtlFsmInterpreter = interpret(machine)
      this.__serviceCtlFsmInterpreter.start()
    }

    override start (): Promise<void> {
      this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'start()')
      guardMachineEvent(this.__serviceCtlFsmInterpreter, 'START')

      const started   = waitForMachineState(this.__serviceCtlFsmInterpreter, 'active')
      const canceled  = waitForMachineState(this.__serviceCtlFsmInterpreter, 'canceled')

      this.__serviceCtlFsmInterpreter.send('START')
      this.state.active(true)

      return Promise.race([
        started,
        canceled,
      ]).then(() => {
        this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'start() ... done')
        return undefined
      })
    }

    override stop (): Promise<void> {
      this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'stop()')
      guardMachineEvent(this.__serviceCtlFsmInterpreter, 'STOP')

      const stopped   = waitForMachineState(this.__serviceCtlFsmInterpreter, 'inactive')
      const canceled  = waitForMachineState(this.__serviceCtlFsmInterpreter, 'canceled')

      this.__serviceCtlFsmInterpreter.send('STOP')
      this.state.inactive(true)

      return Promise.race([
        stopped,
        canceled,
      ]).then(() => {
        this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'stop() ... done')
        return undefined
      })
    }

    reset (): Promise<void> {
      this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'reset()')
      guardMachineEvent(this.__serviceCtlFsmInterpreter, 'RESET')

      const started   = waitForMachineState(this.__serviceCtlFsmInterpreter, 'active')
      const canceled  = waitForMachineState(this.__serviceCtlFsmInterpreter, 'canceled')

      this.__serviceCtlFsmInterpreter.send('RESET')

      // TODO: emit('error' e) if there's any rejections inside `reset()`
      //  or the error should be handled by the onStart/onStop ?

      return Promise.race([
        started,
        canceled,
      ]).then(() => {
        this.__serviceCtlLogger.verbose(`ServiceCtlFsm<${serviceCtlName}>`, 'reset() ... done')
        return undefined
      })
    }

    /**
     * onStart & onStop must be implemented by the child class
     */
    abstract onStart (): Promise<void>
    abstract onStop  (): Promise<void>

  }

  return ServiceCtlFsmMixin
}

abstract class ServiceCtlFsm extends serviceCtlFsmMixin()(ServiceableAbstract) {}

export {
  ServiceCtlFsm,
  serviceCtlFsmMixin,
}
