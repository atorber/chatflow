/**
 *   Ducks - https://github.com/huan/ducks
 *
 *   @copyright 2020 Huan LI (李卓桓) <https://github.com/huan>
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
import type {
  Store,
}                         from 'redux'

import {
  VERSION,
}                   from './config.js'

import type {
  Duck,
  OperationsMapObject,
  SelectorsMapObject,
}                         from './duck.js'

/**
 * Map types from a Map Object
 *  https://github.com/microsoft/TypeScript/issues/24220#issuecomment-390063153
 */

type BundleOperations <O extends OperationsMapObject> = {
  [key in keyof O]: ReturnType<O[key]>
}
type DucksifyOperations <D extends Duck> = BundleOperations <D extends { operations: any } ? D['operations'] : {}>

type BundleSelectors <S extends SelectorsMapObject> = {
  [key in keyof S]: ReturnType<S[key]>
}
type DucksifySelectors <D extends Duck> = BundleSelectors <D extends { selectors: any } ? D['selectors'] : {}>

class Bundle <D extends Duck = any> {

  static VERSION = VERSION

  get store () {
    if (!this._store) {
      throw new Error('Bundle store has not been set yet: Bundle can only be used after its store has been initialized.')
    }
    return this._store!
  }

  private _store?: Store

  namespaces: string[]

  get reducer (): D['default']    { return this.duck.default }

  get actions () : D['actions']   { return this.duck.actions }
  get types ()   : D['types']     { return this.duck.types }

  // get epics () : A['epics'] { return this.duck.epics }
  // get sagas () : A['sagas'] { return this.duck.sagas }

  get operations () {
    return this.ducksifiedOperations
  }

  get selectors () {
    return this.ducksifiedSelectors
  }

  protected ducksifiedSelectors  : DucksifySelectors<D>
  protected ducksifiedOperations : DucksifyOperations<D>

  protected get state () : ReturnType<D['default']> {

    // console.info('[duck] state:', this.store.getState())
    // console.info('[duck] namespaces:', this.namespaces)
    // console.info('[duck] state[namespaces[0]]:', this.store.getState()[this.namespaces[0]])
    // console.info('[duck] state[namespaces[1]]:', this.store.getState()[this.namespaces[1]])

    const duckStateReducer = (duckState: any, namespace: string, idx: number) => {
      if (namespace in duckState) {
        return duckState[namespace]
      }
      throw new Error('duckStateReducer() can not get state from namespace: ' + this.namespaces[idx] + ' with index: ' + idx)
    }

    const duckState = this.namespaces.reduce(
      duckStateReducer,
      this.store.getState(),
    )
    return duckState
  }

  constructor (
    public duck: D,
  ) {
    this.namespaces = []

    /**
     * We provide a convenience way to call `selectors` and `operations`
     *  by encapsulating the `store` and `state`(includes the `namespace`)
     *  and take care of them for users
     *
     * Huan(202005): I'd like to call this: ducksify
     */
    this.ducksifiedOperations = this.ducksifyOperations(this.duck)
    this.ducksifiedSelectors  = this.ducksifySelectors(this.duck)
  }

  public setStore (store: Store): void {
    if (this._store) {
      throw new Error('A store has already been set, and it can not be set twice.')
    }
    this._store = store
  }

  public setNamespaces (...namespaces: string[]): void {
    if (this.namespaces.length > 0) {
      throw new Error('Namespaces has already been set, and it can not be set twice.')
    }
    this.namespaces = namespaces
  }

  protected ducksifyOperations (
    duck: D,
  ): DucksifyOperations<D> {
    let ducksifiedOperations: BundleOperations<any> = {}

    const operations = duck.operations
    if (!operations) {
      return ducksifiedOperations
    }

    const that = this

    Object.keys(operations).forEach(operation => {
      /**
       * Inferred function names
       *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
       */
      ducksifiedOperations = {
        ...ducksifiedOperations,
        [operation]: function (...args: any[]) {
          return operations[operation]!(
          /**
           * We have to make sure `store` has been initialized before the following code has been ran
           */
            that.store.dispatch
          )(...args)
        },
      }
    })
    return ducksifiedOperations
  }

  protected ducksifySelectors (
    duck: D,
  ): DucksifySelectors<D> {
    let ducksifiedSelectors: BundleSelectors<any> = {}
    const selectors = duck.selectors

    if (!selectors) {
      return ducksifiedSelectors
    }

    const that = this
    Object.keys(selectors).forEach(selector => {
      /**
       * Inferred function names
       *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
       */
      ducksifiedSelectors = {
        ...ducksifiedSelectors,
        [selector]: function (...args: any[]) {
          return selectors[selector]!(
            that.state,
          )(...args)
        },
      }
    })
    return ducksifiedSelectors
  }

}

export {
  Bundle,
}
