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
import {
  Observable,
  Subject,
}               from 'rxjs'
import type { Store } from 'redux'

import * as duck from '../duck/mod.js'

import type {
  PuppetRegistry,
}                       from './registry.js'

interface RegisterPuppetOptions {
  store?   : Store,
  wechaty? : WECHATY.impls.WechatyInterface
}

const puppetRef = new Map<string, number>()

const increasePuppetReferenceInRegistry = (registry: PuppetRegistry) => (puppet: PUPPET.impls.PuppetInterface) => {
  const counter    = puppetRef.get(puppet.id) ?? 0
  const incCounter = counter + 1

  if (incCounter === 1) {
    registry.set(puppet.id, puppet)
  }

  puppetRef.set(puppet.id, incCounter)

  return incCounter
}

const decreasePuppetReferenceInRegistry = (registry: PuppetRegistry) => (puppet: PUPPET.impls.PuppetInterface) => {
  const counter    = puppetRef.get(puppet.id) ?? 0
  const decCounter = counter - 1

  puppetRef.set(puppet.id, decCounter)

  if (decCounter <= 0) {
    registry.delete(puppet.id)
    puppetRef.delete(puppet.id)
  }

  return decCounter
}

type RegisterPuppetActionPayload = ReturnType<typeof duck.actions.REGISTER_PUPPET_COMMAND>

/**
 * Puppet will be automatic registered/deregistered inside the RxJS operator
 *
 *  - Creating new operators from scratch
 *    @see https://rxjs.dev/guide/operators
 *
 */
const registerPuppetInRegistry = (registry: PuppetRegistry) =>
  <T> (
    puppet   : PUPPET.impls.PuppetInterface,
    options? : RegisterPuppetOptions,
  ) =>
    (observable: Observable<T>) => new Observable<T | RegisterPuppetActionPayload>(subscriber => {
      /**
       * For emitting the `RregisterPuppet` action
       */
      const proxySubject = new Subject<T | RegisterPuppetActionPayload>()

      /**
       * Chain the subscription to the observable
       */
      const proxySubscription = observable.subscribe(proxySubject)
      const finalSubscription = proxySubject.subscribe(subscriber)

      const counter = increasePuppetReferenceInRegistry(registry)(puppet)
      /**
       * Emit `RegisterPuppet` action when first time subscribe to the puppet
       */
      if (counter === 1) {
        proxySubject.next(
          duck.actions.REGISTER_PUPPET_COMMAND(puppet.id),
        )

        if (options?.store && options.wechaty) {
          options.store.dispatch(
            duck.actions.BIND_WECHATY_PUPPET_COMMAND({
              puppetId : puppet.id,
              wechatyId: options.wechaty.id,
            }),
          )
        }

      }

      /**
       * Return the teardown logic.
       *
       * This will be invoked when the result errors, completes, or is unsubscribed.
       */
      return () => {
        finalSubscription.unsubscribe()
        proxySubscription.unsubscribe()

        /**
         * Cleanup puppet in registry with reference counter
         */
        const counter = decreasePuppetReferenceInRegistry(registry)(puppet)

        if (counter <= 0) {
          if (options?.store) {
            /**
             * Unbind Wechaty <> Puppet
             */
            if (options.wechaty) {
              options.store.dispatch(
                duck.actions.UNBIND_WECHATY_PUPPET_COMMAND({
                  puppetId : puppet.id,
                  wechatyId: options.wechaty.id,
                }),
              )
            }
            /**
             * Deregister Puppet
             */
            options.store.dispatch(duck.actions.DEREGISTER_PUPPET_COMMAND(puppet.id))
          }
        }
      }
    })

export {
  type RegisterPuppetOptions,
  registerPuppetInRegistry,
  increasePuppetReferenceInRegistry,
  decreasePuppetReferenceInRegistry,
  puppetRef,
}
