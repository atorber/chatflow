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
import { isActionOf } from 'typesafe-actions'
import {
  EMPTY,
  of,
}                     from 'rxjs'
import {
  ignoreElements,
  catchError,
  filter,
  mergeMap,
}                     from 'rxjs/operators'
import type { Epic }  from 'redux-observable'
import { GError }     from 'gerror'

import { getPuppet }  from '../registry/mod.js'

import * as actions   from './actions.js'

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
export const dingEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.DING_COMMAND)),
  mergeMap(action => of(getPuppet(action.meta.puppetId)).pipe(
    mergeMap(puppet => puppet
      ? of(puppet.ding(action.payload.data))
      : EMPTY,
    ),
    ignoreElements(),
    catchError(e => of(
      actions.ERROR_RECEIVED_EVENT(
        action.meta.puppetId,
        { gerror: GError.stringify(e) },
      ),
    )),
  )),
)

export const resetEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.RESET_COMMAND)),
  mergeMap(action => of(getPuppet(action.meta.puppetId)).pipe(
    mergeMap(puppet => puppet
      ? of(puppet.reset())
      : EMPTY,
    ),
    ignoreElements(),
    catchError((e: Error) => of(
      actions.ERROR_RECEIVED_EVENT(
        action.meta.puppetId,
        { gerror: GError.stringify(e) },
      ),
    )),
  )),
)
