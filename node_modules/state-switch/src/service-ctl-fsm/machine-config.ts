/**
 * @see https://huan.github.io/state-switch/
 */
import type { MachineConfig } from 'xstate'

interface ServiceCtlEvent {
  type:
    | 'START'
    | 'STOP'
    | 'RESET'
    | 'CANCEL'
}

interface ServiceCtlAction {
  type: never
    // | 'onEntry'
    // | 'onExit'
}

interface ServiceCtlState {
  states: {
      active   : {}
      inactive : {}
      //
      resetting : {}
      starting  : {}
      stopping  : {}
      //
      canceled: {}
  };
}

const inactive = {
  // entry : 'onEntry',
  // exit  : 'onExit',
  on: {
    START: 'starting',
  },
} as const

const starting = {
  invoke: {
    onDone  : 'active',
    onError : 'canceled',
    src     : 'start',
  },
  on: {
    CANCEL: 'inactive',
  },
} as const

const active = {
  // entry : 'onEntry',
  // exit  : 'onExit',
  on: {
    RESET : 'resetting',
    STOP  : 'stopping',
  },
} as const

const stopping = {
  invoke: {
    onDone  : 'inactive',
    onError : 'canceled',
    src     : 'stop',
  },
  on: {
    CANCEL: 'inactive',
  },
} as const

const resetting = {
  invoke: {
    onDone  : 'active',
    onError : 'canceled',
    src     : 'reset',
  },
  on: {
    CANCEL: 'inactive',
  },
} as const

const canceled = {
  // entry : 'onEntry',
  // exit  : 'onExit',
  on: {
    RESET : 'resetting',
    START : 'starting',
    STOP  : 'stopping',
  },
} as const

const states = {
  active,
  canceled,
  inactive,
  resetting,
  starting,
  stopping,
} as const

const initialContext = () => ({
  counter: 0,
})

type ServiceCtlContext = ReturnType<typeof initialContext>

const config: MachineConfig<
  ServiceCtlContext,
  ServiceCtlState,
  ServiceCtlEvent
> = {
  context: initialContext(),
  id: 'ServiceCtlMachine',
  initial: 'inactive',
  states,
} as const

export type {
  ServiceCtlAction,
  ServiceCtlContext,
  ServiceCtlEvent,
  ServiceCtlState,
}
export { config }
