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
import type { Store }     from 'redux'
import { log }            from 'wechaty-puppet'
import type * as WECHATY  from 'wechaty'

import * as duck from '../duck/mod.js'

import type {
  WechatyRegistry,
  // WechatyLike,
}                     from './registry.js'

const wechatyRef = new Map<string, number>()

const increaseWechatyReferenceInRegistry = (registry: WechatyRegistry) => (wechaty: WECHATY.impls.WechatyInterface) => {
  const counter    = wechatyRef.get(wechaty.id) ?? 0
  const incCounter = counter + 1
  log.verbose('WechatyRedux', 'increaseWechatyReferenceInRegistry() counter: %d', incCounter)

  if (incCounter === 1) {
    log.verbose('WechatyRedux', 'increaseWechatyReferenceInRegistry() register wechaty id: %s', wechaty.id)
    registry.set(wechaty.id, wechaty)
  }

  wechatyRef.set(wechaty.id, incCounter)

  return incCounter
}

const decreaseWechatyReferenceInRegistry = (registry: WechatyRegistry) => (wechaty: WECHATY.impls.WechatyInterface) => {
  const counter    = wechatyRef.get(wechaty.id) ?? 0
  const decCounter = counter - 1
  log.verbose('WechatyRedux', 'decreaseWechatyReferenceInRegistry() counter: %d', decCounter)

  wechatyRef.set(wechaty.id, decCounter)

  if (decCounter <= 0) {
    log.verbose('WechatyRedux', 'decreaseWechatyReferenceInRegistry() deregister wechaty id: %s', wechaty.id)
    registry.delete(wechaty.id)
    wechatyRef.delete(wechaty.id)
  }

  return decCounter
}

/**
 * Wechaty automatic registration RxJS operator
 *
 *  - Creating new operators from scratch
 *    @see https://rxjs.dev/guide/operators
 *
 */
const registerWechatyInRegistry = (registry: WechatyRegistry) => (
  wechaty : WECHATY.impls.WechatyInterface,
  store   : Store,
): () => void => {
  log.verbose('WechatyRedux', 'registerWechatyInRegistry() wechaty id: %s', wechaty.id)

  const counter = increaseWechatyReferenceInRegistry(registry)(wechaty)
  /**
   * Emit `RegisterWechaty` action when first time subscribe to the wechaty
   */
  if (counter === 1) {
    store.dispatch(duck.actions.REGISTER_WECHATY_COMMAND(wechaty.id))
  }

  /**
   * Return the teardown logic.
   *
   * This will be invoked when the result errors, completes, or is unsubscribed.
   */
  return () => {
    log.verbose('WechatyRedux', 'registerWechatyInRegistry() dispose wechaty id: %s', wechaty.id)
    const counter = decreaseWechatyReferenceInRegistry(registry)(wechaty)
    if (counter <= 0) {
      /**
       * Cleanup wechaty in registry with reference counter
       */
      store.dispatch(duck.actions.DEREGISTER_WECHATY_COMMAND(wechaty.id))
    }
  }
}

export {
  registerWechatyInRegistry,
  increaseWechatyReferenceInRegistry,
  decreaseWechatyReferenceInRegistry,
  wechatyRef,
}
