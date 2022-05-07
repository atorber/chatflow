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

/**
 * Pure Events
 */
export const STARTED_EVENT = 'wechaty-redux/STARTED_EVENT'
export const STOPPED_EVENT = 'wechaty-redux/STOPPED_EVENT'

export const STATE_ACTIVATED_EVENT   = 'wechaty-redux/STATE_ACTIVATED_EVENT'
export const STATE_INACTIVATED_EVENT = 'wechaty-redux/STATE_INACTIVATED_EVENT'

export const DONG_RECEIVED_EVENT        = 'wechaty-redux/DONG_RECEIVED_EVENT'
export const ERROR_RECEIVED_EVENT       = 'wechaty-redux/ERROR_RECEIVED_EVENT'
export const FRIENDSHIP_RECEIVED_EVENT  = 'wechaty-redux/FRIENDSHIP_RECEIVED_EVENT'
export const HEARTBEAT_RECEIVED_EVENT   = 'wechaty-redux/HEARTBEAT_RECEIVED_EVENT'
export const LOGIN_RECEIVED_EVENT       = 'wechaty-redux/LOGIN_RECEIVED_EVENT'
export const LOGOUT_RECEIVED_EVENT      = 'wechaty-redux/LOGOUT_RECEIVED_EVENT'
export const MESSAGE_RECEIVED_EVENT     = 'wechaty-redux/MESSAGE_RECEIVED_EVENT'
export const READY_RECEIVED_EVENT       = 'wechaty-redux/READY_RECEIVED_EVENT'
export const RESET_RECEIVED_EVENT       = 'wechaty-redux/RESET_RECEIVED_EVENT'
export const ROOM_INVITE_RECEIVED_EVENT = 'wechaty-redux/ROOM_INVITE_RECEIVED_EVENT'
export const ROOM_JOIN_RECEIVED_EVENT   = 'wechaty-redux/ROOM_JOIN_RECEIVED_EVENT'
export const ROOM_LEAVE_RECEIVED_EVENT  = 'wechaty-redux/ROOM_LEAVE_RECEIVED_EVENT'
export const ROOM_TOPIC_RECEIVED_EVENT  = 'wechaty-redux/ROOM_TOPIC_RECEIVED_EVENT'
export const SCAN_RECEIVED_EVENT        = 'wechaty-redux/SCAN_RECEIVED_EVENT'

/**
* Commands & Responses - Wechaty Puppet
*/
export const DING_COMMAND           = 'wechaty-redux/DING_COMMAND'
export const DING_COMMAND_RESPONSE  = 'wechaty-redux/DING_COMMAND_RESPONSE'

export const RESET_COMMAND          = 'wechaty-redux/RESET_COMMAND'
export const RESET_COMMAND_RESPONSE = 'wechaty-redux/RESET_COMMAND_RESPONSE'

/**
 * @private Commands - Redux
 *
 * Wechaty Redux provide the minimum commands for the system state management:
 *  1. ding: request the `dong` event
 *  2. reset: reset the Wechaty state
 *
 * For more commands, please refer to the Wechaty CQRS:
 *  @link https://github.com/wechaty/cqrs
 */
export const REGISTER_PUPPET_COMMAND   = 'wechaty-redux/REGISTER_PUPPET_COMMAND'
export const DEREGISTER_PUPPET_COMMAND = 'wechaty-redux/DEREGISTER_PUPPET_COMMAND'

export const REGISTER_WECHATY_COMMAND   = 'wechaty-redux/REGISTER_WECHATY_COMMAND'
export const DEREGISTER_WECHATY_COMMAND = 'wechaty-redux/DEREGISTER_WECHATY_COMMAND'

export const BIND_WECHATY_PUPPET_COMMAND   = 'wechaty-redux/BIND_WECHATY_PUPPET_COMMAND'
export const UNBIND_WECHATY_PUPPET_COMMAND = 'wechaty-redux/UNBIND_WECHATY_PUPPET_COMMAND'

export const NOP_COMMAND = 'wechaty-redux/NOP_COMMAND'
