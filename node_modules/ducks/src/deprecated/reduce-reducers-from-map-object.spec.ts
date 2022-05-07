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

import { reduceReducersFromMapObject } from './reduce-reducers-from-map-object.js'

test.skip('DEPRECATED: reduceReducersFromMapObject()', async t => {
  const reducer = reduceReducersFromMapObject({
    counter  : counterDuck.default,
    switcher : switcherDuck.default,
  })

  let state = reducer(undefined as any, { type: 'INIT' })

  t.equal(counterDuck.selectors.getCounter(state)(), 0, 'should get 0 on init')

  /**
   * https://stackoverflow.com/a/44371190/1123955
   *
   * First, reducerAdd is called, which gives us initial state { sum: 0 }
   * Second, reducerMulti is called, which doesn't have payload, so it
   * just returns state unchanged.
   * That's why there isn't any `product` prop.
   */
  t.equal(switcherDuck.selectors.getStatus(state)(), undefined, 'should get ~~false~~ UNDEFINED on init')

  state = reducer(state, counterDuck.actions.tap())
  state = reducer(state, switcherDuck.actions.toggle())

  t.equal(counterDuck.selectors.getCounter(state)(), 1, 'should get 1 after tap()')
  t.equal(switcherDuck.selectors.getStatus(state)(), true, 'should get true after toggle()')
})
