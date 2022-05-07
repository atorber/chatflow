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
import type * as WECHATY  from 'wechaty'

// interface WechatyLike {
//   id: string,
//   puppet?: PUPPET.impls.PuppetInterface
//   once: (eventName: 'puppet', listener: (puppet: PUPPET.impls.PuppetInterface) => void) => void
//   off:  (eventName: 'puppet', listener: (puppet: PUPPET.impls.PuppetInterface) => void) => void
// }

type PuppetRegistry   = Map<string, PUPPET.impls.PuppetInterface>
type WechatyRegistry  = Map<string, WECHATY.impls.WechatyInterface>

const puppetRegistry: PuppetRegistry   = new Map()
const wechatyRegistry: WechatyRegistry = new Map()

const getPuppet   = (id: string) => puppetRegistry.get(id)
const getWechaty  = (id: string) => wechatyRegistry.get(id)

// const getMessage = async (puppetId: string, messageId: string) => puppetPool.get(puppetId)?.messagePayload(messageId)
// const getRoom    = async (puppetId: string, roomId: string)    => puppetPool.get(puppetId)?.roomPayload(roomId)
// const getContact = async (puppetId: string, contactId: string) => puppetPool.get(puppetId)?.contactPayload(contactId)

export {
  type PuppetRegistry,
  type WechatyRegistry,
  // type WechatyLike,
  puppetRegistry,
  wechatyRegistry,
  getPuppet,
  getWechaty,
}
