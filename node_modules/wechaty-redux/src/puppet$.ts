/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import type * as PUPPET   from 'wechaty-puppet'

import {
  fromEvent as rxFromEvent,
  merge,
}                             from 'rxjs'
import type { FromEvent }     from 'typed-emitter/rxjs'
import type { StateSwitch }   from 'state-switch'
import {
  map,
  share,
}                             from 'rxjs/operators'

import {
  registerPuppet,
  RegisterPuppetOptions,
}                         from './registry/mod.js'
import * as duck          from './duck/mod.js'

const fromEvent: FromEvent = rxFromEvent

/**
 * Ducks operations need to get Puppet instance by id
 *   this map is used to store the Puppet instances
 */
const puppet$ = (
  puppetInterface : PUPPET.impls.PuppetInterface,
  options?        : RegisterPuppetOptions,
) => {
  const puppet = puppetInterface as PUPPET.impls.PuppetAbstract

  /**
   * active/inactive state change
   */
  const state = puppet.state as StateSwitch
  const stateActive$   = fromEvent(state, 'active')
  const stateInactive$ = fromEvent(state, 'inactive')

  /**
   * events
   */
  const dong$       = fromEvent(puppet, 'dong')
  const error$      = fromEvent(puppet, 'error')
  const friendship$ = fromEvent(puppet, 'friendship')
  const heartbeat$  = fromEvent(puppet, 'heartbeat')
  const login$      = fromEvent(puppet, 'login')
  const logout$     = fromEvent(puppet, 'logout')
  const message$    = fromEvent(puppet, 'message')
  const ready$      = fromEvent(puppet, 'ready')
  const reset$      = fromEvent(puppet, 'reset')
  const roomInvite$ = fromEvent(puppet, 'room-invite')
  const roomJoin$   = fromEvent(puppet, 'room-join')
  const roomLeave$  = fromEvent(puppet, 'room-leave')
  const roomTopic$  = fromEvent(puppet, 'room-topic')
  const scan$       = fromEvent(puppet, 'scan')
  const start$      = fromEvent(puppet, 'start')
  const stop$       = fromEvent(puppet, 'stop')

  /**
   * Merge everything to one stream$
   */
  return merge(
    /* eslint-disable func-call-spacing */
    /* eslint-disable no-whitespace-before-property */
    stateActive$  .pipe(map(status  => duck.actions.STATE_ACTIVATED_EVENT     (puppet.id, status))),
    stateInactive$.pipe(map(status  => duck.actions.STATE_INACTIVATED_EVENT   (puppet.id, status))),
    start$        .pipe(map(()      => duck.actions.STARTED_EVENT             (puppet.id))),
    stop$         .pipe(map(()      => duck.actions.STOPPED_EVENT             (puppet.id))),

    dong$       .pipe(map(payload => duck.actions.DONG_RECEIVED_EVENT         (puppet.id, payload))),
    error$      .pipe(map(payload => duck.actions.ERROR_RECEIVED_EVENT        (puppet.id, payload))),
    friendship$ .pipe(map(payload => duck.actions.FRIENDSHIP_RECEIVED_EVENT   (puppet.id, payload))),
    heartbeat$  .pipe(map(payload => duck.actions.HEARTBEAT_RECEIVED_EVENT    (puppet.id, payload))),
    login$      .pipe(map(payload => duck.actions.LOGIN_RECEIVED_EVENT        (puppet.id, payload))),
    logout$     .pipe(map(payload => duck.actions.LOGOUT_RECEIVED_EVENT       (puppet.id, payload))),
    message$    .pipe(map(payload => duck.actions.MESSAGE_RECEIVED_EVENT      (puppet.id, payload))),
    ready$      .pipe(map(payload => duck.actions.READY_RECEIVED_EVENT        (puppet.id, payload))),
    reset$      .pipe(map(payload => duck.actions.RESET_RECEIVED_EVENT        (puppet.id, payload))),
    roomInvite$ .pipe(map(payload => duck.actions.ROOM_INVITE_RECEIVED_EVENT  (puppet.id, payload))),
    roomJoin$   .pipe(map(payload => duck.actions.ROOM_JOIN_RECEIVED_EVENT    (puppet.id, payload))),
    roomLeave$  .pipe(map(payload => duck.actions.ROOM_LEAVE_RECEIVED_EVENT   (puppet.id, payload))),
    roomTopic$  .pipe(map(payload => duck.actions.ROOM_TOPIC_RECEIVED_EVENT   (puppet.id, payload))),
    scan$       .pipe(map(payload => duck.actions.SCAN_RECEIVED_EVENT         (puppet.id, payload))),
  ).pipe(
    /**
     * share() === multicast(() => new Subject()).refCount()
     *  @see https://itnext.io/the-magic-of-rxjs-sharing-operators-and-their-differences-3a03d699d255
     */
    share(),
    /**
     * Save the puppet instance to the map when there's any subscription
     *  and automatically remove the puppet instance from the map when there's no subscription
     *
     *  - Huan(202111): put it below the `share()`
     *    because we want to count the ref numbers internally
     */
    registerPuppet(puppet, options),
  )
}

export {
  puppet$,
}
