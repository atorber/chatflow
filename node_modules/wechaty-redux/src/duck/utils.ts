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
import * as PUPPET from 'wechaty-puppet'
import {
  EMPTY,
  from,
  of,
  mergeMap,
  Observable,
}                 from 'rxjs'
import {
  mapTo,
  filter,
  map,
}                 from 'rxjs/operators'

/**
 * TODO: use `dependencies` injection for Ducks dependencies, Huan(202111)
 */
import { getPuppet } from '../registry/registry.js'

import type * as actions from './actions.js'

const throwUndefined = <T> (value?: T): T => {
  if (value) return value
  throw new Error('throwUndefined() value is undefined')
}

const skipUndefined$ = <T> (value?: T): typeof EMPTY | Observable<T> => {
  if (value) return of(value)
  return EMPTY
}
void skipUndefined$

const extendPayloadWithPuppetId = (puppetId: string) => <T> (payload: T): T & { puppetId: string } => ({
  ...payload,
  puppetId,
})

/**
 * Example: `pipe(mergeMap(toMessage$))`
 */
const toMessage$ = (action: ReturnType<typeof actions.MESSAGE_RECEIVED_EVENT>) => from(
  getPuppet(action.meta.puppetId)
    ?.messagePayload(action.payload.messageId) || EMPTY,
).pipe(
  map(throwUndefined),
  map(extendPayloadWithPuppetId(action.meta.puppetId)),
)

const toContact$ = (action: ReturnType<typeof actions.LOGIN_RECEIVED_EVENT>) => from(
  getPuppet(action.meta.puppetId)
    ?.contactPayload(action.payload.contactId) || EMPTY,
).pipe(
  map(throwUndefined),
  map(extendPayloadWithPuppetId(action.meta.puppetId)),
)

const isTextMessage = (text?: string) => (message: PUPPET.payloads.Message) => (
  message.type === PUPPET.types.Message.Text
) && (
  text
    ? text === message.text
    : true
)
const isWechaty = (puppetId: string) => (action: ReturnType<typeof actions.MESSAGE_RECEIVED_EVENT>) => action.meta.puppetId === puppetId

const isSelfMessage = (puppet: PUPPET.impls.PuppetInterface) =>
  (message: PUPPET.payloads.Message) =>
  /**
   * TODO: remove deprecated `fromId` in v2.0
   */
    puppet.isLoggedIn && (message.talkerId || message.fromId)
      ? (message.talkerId || message.fromId) === puppet.currentUserId
      : false
void isSelfMessage

const isNotSelfMessage = (puppet: PUPPET.impls.PuppetInterface) =>
  (message: PUPPET.payloads.Message) => puppet.isLoggedIn
    /**
     * TODO: remove deprecated `fromId` in v2.0
     */
    ? (message.talkerId || message.fromId) !== puppet.currentUserId
    : true

const skipSelfMessage$ = (action: ReturnType<typeof actions.MESSAGE_RECEIVED_EVENT>) => of(
  getPuppet(action.meta.puppetId),
).pipe(
  mergeMap(puppet => puppet
    ? from(puppet.messagePayload(action.payload.messageId)).pipe(
      filter(isNotSelfMessage(puppet)),
      mapTo(action),
    )
    : EMPTY,
  ),
)

export {
  toMessage$,
  toContact$,
  isTextMessage,
  isWechaty,
  skipSelfMessage$,
}
