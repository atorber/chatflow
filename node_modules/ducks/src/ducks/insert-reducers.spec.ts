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

import * as counterDuck  from '../../examples/counter/mod.js'
import * as switcherDuck from '../../examples/switcher/mod.js'

import { combineDuckery }   from './combine-duckery.js'
import { insertReducers } from './insert-reducers.js'

/**
 * Insert switcher to counter
 */
test('insertReducers(counter, switcher)', async t => {
  const originalReducer = combineDuckery({
    counter: counterDuck,
  })

  const insertReducer = {
    switcher: switcherDuck.default,
  }

  const newReducer = insertReducers(
    originalReducer,
    insertReducer,
  )

  // reduce with a unknown type action should get the default state
  const state0 = newReducer(undefined, { type: 'NOOP' } as any)

  t.equal(state0.counter.total, 0, 'should get state.count.total = 0 on initialization')
  t.equal(state0.switcher.status, false, 'should get state.switcher.status = false on initialization')

  const state1 = newReducer(state0, counterDuck.actions.tap())
  t.not(state1, state0, 'should not mutate the state 0')

  /**
   * We have lost the typing information from the switcher Duck
   *  because the Reducer is using the AnyAction
   */
  const state2 = newReducer(state1, switcherDuck.actions.toggle() as any)
  t.not(state2, state1, 'should not mutate the state 1')

  t.equal(state2.counter.total, 1, 'should get state.count.total = 1 after tap()')
  t.equal(state2.switcher.status, true, 'should get state.switcher.status = true after toggle()')

  const state3 = newReducer(state2, { type: 'NOOP' } as any)
  t.equal(state3, state2, 'state should not change if reducer got unknown action type')
})

/**
 * Insert counter to switcher
 */
test('insertReducers(switcher, counter)', async t => {
  const originalReducer = combineDuckery({
    switcher: switcherDuck,
  })

  const insertReducer = {
    counter: counterDuck.default,
  }

  const newReducer = insertReducers(
    originalReducer,
    insertReducer,
  )

  // reduce with a unknown type action should get the default state
  const state0 = newReducer(undefined, { type: 'NOOP' } as any)

  t.equal(state0.counter.total, 0, 'should get state.count.total = 0 on initialization')
  t.equal(state0.switcher.status, false, 'should get state.switcher.status = false on initialization')

  const state1 = newReducer(state0, counterDuck.actions.tap())
  t.not(state1, state0, 'should not mutate the state 0')

  const state2 = newReducer(state1, switcherDuck.actions.toggle())
  t.not(state2, state1, 'should not mutate the state 1')

  t.equal(state2.counter.total, 1, 'should get state.count.total = 1 after tap()')
  t.equal(state2.switcher.status, true, 'should get state.switcher.status = true after toggle()')

  const state3 = newReducer(state2, { type: 'NOOP' } as any)
  t.equal(state3, state2, 'state should not change if reducer got unknown action type')
})
