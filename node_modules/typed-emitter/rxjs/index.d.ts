/**
 * devanshj/rxjs-from-emitter#4 - typed-emitter compatibility
 * 
 * @see https://github.com/devanshj/rxjs-from-emitter/issues/4#issuecomment-665104646
 */
/* eslint-disable no-use-before-define */
import { 
  fromEvent as rxFromEvent, 
  Observable,
} from 'rxjs'
import type TypedEventEmitter from '../index'

type ObservedValue<A extends unknown[]> =
  A['length'] extends 0 ? void :
  A['length'] extends 1 ? A[0] :
  A

interface FromTypedEvent {
  <   Emitter extends TypedEventEmitter<any>
    , EventName extends keyof Events
    , Events = Emitter extends TypedEventEmitter<infer T> ? T : never
  >(emitter: Emitter, event: EventName): Observable<ObservedValue<Events[EventName] extends (...args: infer A) => any ? A : never>>   
}

export type FromEvent = FromTypedEvent & typeof rxFromEvent
