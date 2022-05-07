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
/* eslint-disable sort-keys */
import {
  createAction,
}                         from 'typesafe-actions'
import type * as PUPPET   from 'wechaty-puppet'

import * as types from './types.js'

/**
 * We put `puppetId` in the meta property
 *
 * This must be sync with CQRS Wechaty module
 */
const metaPuppetId = (puppetId: string, ..._: any)  => ({ puppetId })

/**
 * @private Registery Actions Payload
 */
const payloadPuppetId         = (puppetId:  string) => ({ puppetId })
const payloadWechatyId        = (wechatyId: string) => ({ wechatyId })
const payloadWechatyPuppetId  = (options: { wechatyId: string, puppetId: string })  => options

/**
 * @private Registry Actions Creators
 */
export const REGISTER_PUPPET_COMMAND    = createAction(types.REGISTER_PUPPET_COMMAND,   payloadPuppetId)()
export const DEREGISTER_PUPPET_COMMAND  = createAction(types.DEREGISTER_PUPPET_COMMAND, payloadPuppetId)()

export const REGISTER_WECHATY_COMMAND    = createAction(types.REGISTER_WECHATY_COMMAND,   payloadWechatyId)()
export const DEREGISTER_WECHATY_COMMAND  = createAction(types.DEREGISTER_WECHATY_COMMAND, payloadWechatyId)()

export const BIND_WECHATY_PUPPET_COMMAND   = createAction(types.BIND_WECHATY_PUPPET_COMMAND,   payloadWechatyPuppetId)()
export const UNBIND_WECHATY_PUPPET_COMMAND = createAction(types.UNBIND_WECHATY_PUPPET_COMMAND, payloadWechatyPuppetId)()

/**
 * @public
 *
 * Event Actions' Payloads
 */
const payloadStateActive   = (_puppetId: string, state: true | 'pending') => ({ state })
const payloadStateInactive = (_puppetId: string, state: true | 'pending') => ({ state })

const payloadEventDong           = (_puppetId: string, payload: PUPPET.payloads.EventDong)       => payload
const payloadEventError          = (_puppetId: string, payload: PUPPET.payloads.EventError)      => payload
const payloadEventHeartbeat      = (_puppetId: string, payload: PUPPET.payloads.EventHeartbeat)  => payload
const payloadEventReady          = (_puppetId: string, payload: PUPPET.payloads.EventReady)      => payload
const payloadEventReset          = (_puppetId: string, payload: PUPPET.payloads.EventReset)      => payload
const payloadEventFriendship     = (_puppetId: string, payload: PUPPET.payloads.EventFriendship) => payload
const payloadEventLogin          = (_puppetId: string, payload: PUPPET.payloads.EventLogin)      => payload
const payloadEventLogout         = (_puppetId: string, payload: PUPPET.payloads.EventLogout)     => payload
const payloadEventMessage        = (_puppetId: string, payload: PUPPET.payloads.EventMessage)    => payload
const payloadEventRoomInvitation = (_puppetId: string, payload: PUPPET.payloads.EventRoomInvite) => payload
const payloadEventRoomJoin       = (_puppetId: string, payload: PUPPET.payloads.EventRoomJoin)   => payload
const payloadEventRoomLeave      = (_puppetId: string, payload: PUPPET.payloads.EventRoomLeave)  => payload
const payloadEventRoomTopic      = (_puppetId: string, payload: PUPPET.payloads.EventRoomTopic)  => payload
const payloadEventScan           = (_puppetId: string, payload: PUPPET.payloads.EventScan)       => payload

/**
 * Actions: StateState
 */
export const STATE_ACTIVATED_EVENT    = createAction(types.STATE_ACTIVATED_EVENT,   payloadStateActive,   metaPuppetId)()
export const STATE_INACTIVATED_EVENT  = createAction(types.STATE_INACTIVATED_EVENT, payloadStateInactive, metaPuppetId)()

export const STARTED_EVENT = createAction(types.STARTED_EVENT, payloadPuppetId, metaPuppetId)()
export const STOPPED_EVENT = createAction(types.STOPPED_EVENT, payloadPuppetId, metaPuppetId)()

/**
 * Actions: Pure Events
 */
export const DONG_RECEIVED_EVENT        = createAction(types.DONG_RECEIVED_EVENT,        payloadEventDong,           metaPuppetId)()
export const ERROR_RECEIVED_EVENT       = createAction(types.ERROR_RECEIVED_EVENT,       payloadEventError,          metaPuppetId)()
export const FRIENDSHIP_RECEIVED_EVENT  = createAction(types.FRIENDSHIP_RECEIVED_EVENT,  payloadEventFriendship,     metaPuppetId)()
export const HEARTBEAT_RECEIVED_EVENT   = createAction(types.HEARTBEAT_RECEIVED_EVENT,   payloadEventHeartbeat,      metaPuppetId)()
export const LOGIN_RECEIVED_EVENT       = createAction(types.LOGIN_RECEIVED_EVENT,       payloadEventLogin,          metaPuppetId)()
export const LOGOUT_RECEIVED_EVENT      = createAction(types.LOGOUT_RECEIVED_EVENT,      payloadEventLogout,         metaPuppetId)()
export const MESSAGE_RECEIVED_EVENT     = createAction(types.MESSAGE_RECEIVED_EVENT,     payloadEventMessage,        metaPuppetId)()
export const READY_RECEIVED_EVENT       = createAction(types.READY_RECEIVED_EVENT,       payloadEventReady,          metaPuppetId)()
export const RESET_RECEIVED_EVENT       = createAction(types.RESET_RECEIVED_EVENT,       payloadEventReset,          metaPuppetId)()
export const ROOM_INVITE_RECEIVED_EVENT = createAction(types.ROOM_INVITE_RECEIVED_EVENT, payloadEventRoomInvitation, metaPuppetId)()
export const ROOM_JOIN_RECEIVED_EVENT   = createAction(types.ROOM_JOIN_RECEIVED_EVENT,   payloadEventRoomJoin,       metaPuppetId)()
export const ROOM_LEAVE_RECEIVED_EVENT  = createAction(types.ROOM_LEAVE_RECEIVED_EVENT,  payloadEventRoomLeave,      metaPuppetId)()
export const ROOM_TOPIC_RECEIVED_EVENT  = createAction(types.ROOM_TOPIC_RECEIVED_EVENT,  payloadEventRoomTopic,      metaPuppetId)()
export const SCAN_RECEIVED_EVENT        = createAction(types.SCAN_RECEIVED_EVENT,        payloadEventScan,           metaPuppetId)()

/**
 * Commands
 *
 * Wechaty Redux provide the minimum commands for the system state management:
 *  1. ding: request the `dong` event
 *  2. reset: reset the Wechaty state
 *
 * For more commands, please refer to the Wechaty CQRS:
 *  @link https://github.com/wechaty/cqrs
 */
const payloadData  = (_puppetId: string, data?: string) => ({ data })

export const DING_COMMAND  = createAction(types.DING_COMMAND,  payloadData, metaPuppetId)()
export const RESET_COMMAND = createAction(types.RESET_COMMAND, payloadData, metaPuppetId)()

/**
 * @private Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
export const NOP_COMMAND = createAction(types.NOP_COMMAND)()
