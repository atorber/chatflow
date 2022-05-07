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
import { test } from 'tstest'

import reducer from './reducers.js'

import * as actions from './actions.js'

test('ducks reducer initial state', async t => {
  let state = reducer(undefined, {} as any)
  t.same(state, {}, 'should return the initial state')

  state = reducer(state, actions.noop())
  t.same(state, {}, 'should return the noop state')
})
