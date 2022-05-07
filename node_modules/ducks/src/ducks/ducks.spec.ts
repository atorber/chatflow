#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

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
import { test }  from 'tstest'

import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
}                   from 'redux'

import { createEpicMiddleware } from 'redux-observable'
// import createSagaMiddleware     from 'redux-saga'

import { Ducks } from './ducks.js'

import * as counterDuck  from '../../examples/counter/mod.js'
import * as dingdongDuck from '../../examples/ding-dong/mod.js'
import * as pingpongDuck from '../../examples/ping-pong/mod.js'
import * as switcherDuck from '../../examples/switcher/mod.js'

test('construction()', async t => {
  t.throws(() => new Ducks({}), 'should not happy with empty duckery')

  t.doesNotThrow(() => new Ducks({
    counter : counterDuck,
    dong    : dingdongDuck,
    pong    : pingpongDuck,
  }), 'should be able to construct with ducks')
})

test('reducer()', async t => {
  const ducks = new Ducks({
    counter : counterDuck,
  })

  const initialState = {}
  const store = createStore(
    (state?: object) => ({ ...state }),
    initialState,
    compose(
      ducks.enhancer(),
    ),
  )

  void store
  // store.subscribe(() => console.info(store.getState()))

  const { counter } = ducks.ducksify()

  t.equal(counter.selectors.getCounter(), 0, 'should get counter 0 after initialization')
  counter.operations.tap()
  t.equal(counter.selectors.getCounter(), 1, 'should get counter 1 after tap')
})

test('constructor() with option.middleware', async t => {
  const epicMiddleware = createEpicMiddleware()

  /**
   * Huan(202109): https://github.com/huan/ducks/issues/4
   */
  // const sagaMiddleware = createSagaMiddleware()

  const ducks = new Ducks({
    dong    : dingdongDuck,
    pong    : pingpongDuck,
  })

  t.doesNotThrow(
    () => createStore(
      state => state,
      compose(
        ducks.enhancer(),
        applyMiddleware(
          epicMiddleware,
          // sagaMiddleware,
        ),
      ),
    ),
    'should not throw when satisfied the middleware in Ducks constructor options',
  )
})

/**
 * Huan(202109): disable saga
 *  See: https://github.com/huan/ducks/issues/4
 */
// test('Sagas middlewares', async t => {
//   const sagaMiddleware = createSagaMiddleware()

//   const ducks = new Ducks({
//     pong    : pingpongDuck,
//   })

//   const {
//     pong,
//   }         = ducks.ducksify()

//   const store = createStore(
//     state => state,
//     compose(
//       ducks.enhancer(),
//       applyMiddleware(
//         sagaMiddleware,
//       ),
//     ),
//   )

//   void store

//   t.equal(pong.selectors.getPong(), 0, 'should get pong 0 on initialization')

//   pong.operations.ping()

//   t.equal(pong.selectors.getPong(), 1, 'should get pong 1 after operations.ping()')
// })

test('Epics middlewares', async t => {
  const ducks = new Ducks({ dong: dingdongDuck })
  const dong  = ducks.ducksify('dong')

  const epicMiddleware = createEpicMiddleware()

  /* const store = */ createStore(
    state => state,
    compose(
      ducks.enhancer(),
      applyMiddleware(
        epicMiddleware,
      ),
    ),
  )

  t.equal(dong.selectors.getDong(), 0, 'should get dong 0 on initialization')

  dong.operations.ding()

  t.equal(dong.selectors.getDong(), 1, 'should get dong 1 after operations.ding()')
})

test('Ducks with other reducers work together', async t => {
  const ducks = new Ducks({
    counter : counterDuck,
  })

  const { counter } = ducks.ducksify()

  const store = createStore(
    combineReducers({
      switch: switcherDuck.default,
    }),
    compose(
      ducks.enhancer(),
    ),
  )

  void store
  // store.subscribe(() => console.info(store.getState()))

  t.equal(counter.selectors.getCounter(), 0, 'should get counter 0 on initialization')
  t.equal(store.getState().switch.status, false, 'should get false from switch status on initialization')

  counter.operations.tap()
  t.equal(counter.selectors.getCounter(), 1, 'should get counter 1 after tap')

  store.dispatch(switcherDuck.actions.toggle())
  t.equal(store.getState().switch.status, true, 'should get true from switch status after dispatch actions.toggle()')
})

test('configureStore() smoke testing', async t => {
  const ducks = new Ducks({
    counter : counterDuck,
  })

  const { counter } = ducks.ducksify()

  const store = ducks.configureStore()
  void store
  // store.subscribe(() => console.info(store.getState()))

  t.equal(counter.selectors.getCounter(), 0, 'should get counter 0 on initialization')
  counter.operations.tap()
  t.equal(counter.selectors.getCounter(), 1, 'should get counter 1 after tap')
})

test('configureStore() called twice', async t => {
  const ducks = new Ducks({
    counter : counterDuck,
  })

  t.doesNotThrow(() => ducks.configureStore(), 'should not throw for the first time')
  t.throws(() => ducks.configureStore(), 'should throw for the second time')
})

test('ducksify(namespace & duck)', async t => {
  const ducks = new Ducks({
    counter : counterDuck,
    switcher: switcherDuck,
  })

  const {
    counter,
    switcher,
  } = ducks.ducksify()

  const counterByName = ducks.ducksify('counter')
  const switcherByName = ducks.ducksify('switcher')

  const counterByDuck = ducks.ducksify(counterDuck)
  const switcherByDuck = ducks.ducksify(switcherDuck)

  t.equal(counter, counterByName, 'counter should be same with by name')
  t.equal(counter, counterByDuck, 'counter should be same with by duck')

  t.equal(switcher, switcherByName, 'switcher should be same with by name')
  t.equal(switcher, switcherByDuck, 'switcher should be same with by duck')
})
