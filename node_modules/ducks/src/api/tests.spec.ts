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

import {
  createStore,
}                         from 'redux'

import {
  validateDuck,
}                     from '../mod.js'

import * as duck from './mod.js'

validateDuck(duck)

test('noop', async t => {
  const store = createStore(duck.default)

  let noop = duck.selectors.getNoop(store.getState())()
  t.notOk(noop, 'should be undefined')

  store.dispatch(duck.actions.noop())

  noop = duck.selectors.getNoop(store.getState())()
  t.notOk(noop, 'should be undefined after noop')
})

test('operations', async t => {
  const store = createStore(duck.default)

  duck.operations.noop(store.dispatch)()

  const noop = duck.selectors.getNoop(store.getState())()
  t.notOk(noop, 'should be undefined after operations.noop(store)()')
})
