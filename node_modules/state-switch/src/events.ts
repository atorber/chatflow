import { EventEmitter }         from 'events'
import type TypedEventEmitter   from 'typed-emitter'

/**
 * Using Three Valued Logic for ON/OFF State
 *  https://github.com/huan/state-switch/issues/1
 *
 * Three-valued Logic (3VL): `true`, `false`, and
 *  'pending': it's in process, not stable.
 */
 type Pending = 'pending'

export type ActiveListener    = (state: true | Pending) => void | Promise<void>
export type InactiveListener  = (state: true | Pending) => void | Promise<void>

interface StateSwitchEventListener {
  active   : ActiveListener
  inactive : InactiveListener
}

const StateSwitchEventEmitter = EventEmitter as unknown as new () => TypedEventEmitter<
  StateSwitchEventListener
>

type StateType = keyof StateSwitchEventListener

export type {
  Pending,
  StateType,
}
export {
  StateSwitchEventEmitter,
}
