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
import { log }            from 'wechaty-puppet'
import type * as WECHATY  from 'wechaty'
import type {
  Store,
}                         from 'redux'

import {
  registerWechaty,
}                   from './registry/mod.js'

import { puppet$ }  from './puppet$.js'

type VoidFunction = () => void

interface WechatyReduxOptions {
  store: Store,
}

function WechatyRedux (options: WechatyReduxOptions) {
  log.verbose('WechatyRedux', '(%s)', JSON.stringify(options))

  const store = options.store

  const uninstallerList: VoidFunction[] = []

  return function WechatyReduxPlugin (wechaty: WECHATY.impls.WechatyInterface): VoidFunction {
    log.verbose('WechatyRedux', 'WechatyReduxPlugin(%s)', wechaty)

    /**
     * Register Wechaty to the Registry
     *  to support `getWechaty(id)` usage in the future
     */
    const deregister = registerWechaty(wechaty, store)
    uninstallerList.push(() => deregister())

    /**
     * Huan(202203): The `wechaty.puppet` MUST be instanciated
     *  before using the Redux plugin
     */
    const sub = puppet$(wechaty.puppet, {
      store,
      wechaty,
    }).subscribe(store.dispatch)

    uninstallerList.push(() => sub.unsubscribe())

    return () => {
      uninstallerList.forEach(setImmediate)
      uninstallerList.length = 0
    }
  }
}

export {
  type WechatyReduxOptions,
  WechatyRedux,
}
