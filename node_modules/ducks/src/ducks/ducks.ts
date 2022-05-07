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
import {
  StoreEnhancer,
  compose,
  Middleware,
  Store,
  applyMiddleware,
  Reducer,
  createStore,
}                               from 'redux'

import type {
  Epic,
  EpicMiddleware,
}                         from 'redux-observable'
import {
  createEpicMiddleware,
  combineEpics,
}                         from 'redux-observable'
import type {
  Saga,
  SagaMiddleware,
}                   from 'redux-saga'

import {
  DUCKS_NAMESPACE,
  VERSION,
}                      from '../config.js'

import {
  Bundle,
}                         from '../bundle.js'

import type {
  Duck,
  DucksMapObject,
}                 from '../duck.js'

import { combineDuckery } from './combine-duckery.js'
import { insertReducers } from './insert-reducers.js'
import { noopReducer }     from './noop-reducer.js'

export type BundlesMapObject <A extends DucksMapObject> = {
  [key in keyof A]: Bundle<A[key]>
}

class Ducks <A extends DucksMapObject> {

  static VERSION = VERSION

  get store () {
    return this._store
  }

  protected _store?: Store

  protected ducksNest: BundlesMapObject<A>

  protected asyncMiddlewares: {
    epicMiddleware?: EpicMiddleware<any>,
    sagaMiddleware?: SagaMiddleware,
  }

  protected get reducer () {
    return combineDuckery(this.duckery)
  }

  protected get middlewares (): Middleware[] {
    const middlewareList = Object.values(this.duckery)
      .map(duck => duck.middlewares)
      .filter(Boolean)
      .map(middlewares => Object.values(middlewares!))
      .flat()

    return middlewareList
  }

  /**
   * Construct a `Ducks` manager for managing the Duck(s)
   *
   * @param duckery is a `DucksMapObject` which:
   *  1. key is the reducer key (namespace)
   *  2. value is a `Duck` instance
   */
  constructor (
    protected readonly duckery: A,
  ) {
    if (Object.keys(duckery).length <= 0) {
      throw new Error('You need to provide at least one duck for the duckery')
    }
    this.asyncMiddlewares = {}

    const ducksNest = {} as any
    for (const [ns, duck] of Object.entries(duckery)) {
      ducksNest[ns as string] = new Bundle(duck)

      /**
       * Huan(202006): Binding the Ducks to Duck,
       *  so that the Duck can use other Duck modules (if needed)
       */
      if (duck.setDucks) {
        duck.setDucks(this)
      }
    }
    this.ducksNest = ducksNest
  }

  /**
   * Return all Ducks
   */
  ducksify (): BundlesMapObject<A>
  /**
   * Return the Duck of `namespace`
   * @param namespace
   */
  ducksify <NS extends keyof A> (namespace: NS): Bundle<A[NS]>
  /**
   * Return the Bundle of `duck`
   * @param duck
   */
  ducksify <NS extends keyof A> (duck: A[NS]): Bundle<A[NS]>

  ducksify (nsOrDuck?: string | Duck): BundlesMapObject<A> | Bundle {
    if (!nsOrDuck) {
      return this.ducksNest
    }

    if (typeof nsOrDuck === 'string') {
      if (nsOrDuck in this.duckery) {
        return this.ducksNest[nsOrDuck]!
      }
      throw new Error('Ducks can not found the Duck for the namespace: ' + nsOrDuck)
    }

    if (typeof nsOrDuck === 'object') {
      const namespaceList = Object.keys(this.duckery)
        .filter(ns => this.duckery[ns] === nsOrDuck)
      if (namespaceList.length <= 0) {
        throw new Error('Duck not found: ' + nsOrDuck)
      }
      const namespace = namespaceList[0]!
      return this.ducksify(namespace)
    }

    throw new Error('unknown param: ' + nsOrDuck)
  }

  enhancer (): ReturnType<Ducks<A>['duckeryEnhancer']> {
    if (!this.asyncMiddlewares.epicMiddleware && this.getRootEpic()) {
      this.asyncMiddlewares.epicMiddleware = createEpicMiddleware()
    }
    if (!this.asyncMiddlewares.sagaMiddleware && this.getRootSaga()) {
      /**
       * Huan(202109): disable saga
       *  See: https://github.com/huan/ducks/issues/4
       */
      // this.asyncMiddlewares.sagaMiddleware = require('redux-saga').default()
      throw new Error('saga is disabled. See: https://github.com/huan/ducks/issues/4')
    }

    const asyncMiddlewareList = Object.values(this.asyncMiddlewares).filter(Boolean) as Middleware[]

    return compose(
      /**
       * Huan(202005):
       *  the `this.storeEnhancer()` should be put before applyMiddleware
       *  (to initiate asyncMiddlewares before storeEnhancer)
       */
      this.duckeryEnhancer(),

      applyMiddleware(
        ...asyncMiddlewareList,
        ...this.middlewares
      ),
    )
  }

  /**
   * 1. Add Ducks Reducers to Store
   * 2. Bind Store to Ducks
   */
  protected duckeryEnhancer () {
    const enhancer: StoreEnhancer<
      {},
      ReturnType<
        Ducks<A>['reducer']
      >
    > = next => (reducer: Reducer<any, any>, preloadedState: any) => {

      const newReducer = insertReducers(
        reducer,
        {
          [DUCKS_NAMESPACE]: this.reducer as any, // Huan(202005) FIXME: any ?
        },
      )

      // FIXME: any
      const store = next<any, any>(
        newReducer,
        preloadedState,
      )

      this.initializeDucks(store)

      return store
    }
    return enhancer
  }

  /**
   * A convenience way to initialize your store with Ducks with default settings.
   *
   * `ducks.configureStore()` only supports creating a store with Ducks.
   *
   * If you want to create a store that with other `reducer` and `enhances` (or `middlewares`),
   * please use `createStore()` from `redux` module instead of this one.
   *
   * @param preloadedState
   */
  configureStore (
    preloadedState?: {
      [DUCKS_NAMESPACE]: ReturnType<Ducks<A>['reducer']>,
    },
  ) {
    if (this._store) {
      throw new Error('Ducks can be only configureStore() for once! If you need another store, you can create another Ducks to fullfil your needs.')
    }

    const store = createStore(
      noopReducer,
      preloadedState,
      this.enhancer(),
    )
    return store
  }

  /**
   * Initialize ducks
   */
  protected getRootEpic (): undefined | Epic {
    const epics = Object.values(this.duckery)
      .map(duck => duck.epics)
      .filter(Boolean)
      .map(epics => Object.values(epics!))
      .flat()

    if (epics.length <= 0) {
      return undefined
    }

    /**
     * Load Epics Combinator
     *
     *  We are using `require` at here because we will only load `redux-observable` module when we need it
     */
    return combineEpics(...epics) as Epic
  }

  protected getRootSaga (): undefined | Saga {
    const sagas = Object.values(this.duckery)
      .map(duck => duck.sagas)
      .filter(Boolean)
      .map(sagas => Object.values(sagas!))
      .flat()

    if (sagas.length <= 0) {
      return undefined
    }

    /**
     * Load Saga Effects
     *
     *  We are using `require` at here because we will only load `redux-saga` module when we need it
     */

    /**
     * Huan(202109): disable saga
     *  See: https://github.com/huan/ducks/issues/4
     */

    // const effects = require('redux-saga/effects')

    // return function * rootSaga () {
    //   yield effects.all(
    //     sagas.map(
    //       saga => saga()
    //     )
    //   )
    // } as Saga
    throw new Error('Saga is disabled. See: https://github.com/huan/ducks/issues/4')
  }

  protected initializeDucks (store: Store<any, any>) {
    if (this._store) {
      throw new Error('store has already initialized')
    }
    this._store = store

    /**
     * Configure Duck
     */
    Object.keys(this.duckery).forEach(namespace => {
      // console.info('initializeDucks() namespace', namespace)
      // console.info('initializeDucks() state', this.store.getState())
      this.ducksNest[namespace]!.setStore(store)
      this.ducksNest[namespace]!.setNamespaces(DUCKS_NAMESPACE, namespace)
    })

    /**
     * Run Epic
     */
    const rootEpic = this.getRootEpic()
    if (rootEpic) {
      const epicMiddleware = this.asyncMiddlewares.epicMiddleware
      if (!epicMiddleware) {
        throw new Error('epicMiddleware is required but not found in the this.asyncMiddlewares.')
      }
      epicMiddleware.run(rootEpic)
    }

    /**
     * Run Saga
     */
    const rootSaga = this.getRootSaga()
    if (rootSaga) {
      const sagaMiddleware = this.asyncMiddlewares.sagaMiddleware
      if (!sagaMiddleware) {
        throw new Error('sagaMiddleware is required but not found in the this.asyncMiddlewares.')
      }
      sagaMiddleware.run(rootSaga)
    }
  }

}

export {
  Ducks,
}
