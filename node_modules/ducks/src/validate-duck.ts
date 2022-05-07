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
import assert from 'assert'

import type {
  ActionCreator,
  AnyAction,
  Reducer,
}                 from 'redux'

import type { Duck } from './duck.js'

export interface MapObject {
  [key: string]: any,
}

const getLogger = (debug: boolean) => (msg: string) => {
  if (debug) {
    console.info(msg)
  }
}

let log: ReturnType<typeof getLogger>

/**
 * Huan(202005) TODO:
 *  Testing static types in TypeScript
 *    https://2ality.com/2019/07/testing-static-types.html
 *
 * use tsd? tsdlint?
 *
 * To be added in the future:
 *  1. check selectors take a state as argument and returns a function
 *  2. check operations take a store as argument and returns a function
 *  3. Conditional Type Checks - https://github.com/dsherret/conditional-type-checks
 */
function validateDuck <D extends Duck> (duck: D, debug = false) {
  log = getLogger(debug)

  validateActions(duck.actions)
  validateOperations(duck.operations)
  validateReducer(duck.default)
  validateSelectors(duck.selectors)
  validateTypes(duck.types)

  /**
   * Middlewares
   */
  validateMiddlewares(duck.middlewares)
  validateEpics(duck.epics)
  validateSagas(duck.sagas)
  validateSetDucks(duck.setDucks)
}

/**
 *
 * Sub Validating Functions
 *
 */
function validateReducer <T extends Reducer> (reducer: T) {
  assert.strictEqual(typeof reducer, 'function', 'default export should be function')

  // const func = (a = 42, b) => a + b
  // func.length === 0
  // assert.strictEqual(reducer.length, 2, 'reducer should has two arguments. reducer name: ' + reducer.name + ' arguments length: ' + reducer.length + ' reducer function: ' + reducer.toString())
}

function validateActions <T extends MapObject> (actions: T) {
  assert.ok(actions, 'should exported actions')
  for (const [key, val] of Object.entries(actions)) {
    log('validateActions: validating: ' + key + ', ' + val)
    validateString(key)
    validateActionType(val)
  }
}

function validateOperations <T extends MapObject> (operations?: T) {
  if (!operations) {
    return
  }
  assert.ok(operations, 'should exported operations')
  Object.keys(operations).forEach(validateString)
  Object.values(operations).forEach(validateOperationType)
}

function validateSelectors <T extends MapObject> (selectors?: T) {
  if (!selectors) {
    return
  }
  assert.ok(selectors, 'should exported selectors')
  Object.keys(selectors).forEach(validateString)
  Object.values(selectors).forEach(validateSelectorType)
}

function validateTypes <T extends MapObject> (types?: T) {
  if (!types) {
    return
  }
  assert.ok(types, 'should exported types')
  Object.keys(types).forEach(validateString)
  Object.values(types).forEach(validateString)
}

function validateMiddlewares <T extends MapObject> (middlewares?: T) {
  if (!middlewares) {
    return
  }
  Object.keys(middlewares).forEach(validateString)
  Object.values(middlewares).forEach(validateMiddlewareType)
}
function validateSagas <T extends MapObject> (sagas?: T) {
  if (!sagas) {
    return
  }
  Object.keys(sagas).forEach(validateString)
  Object.values(sagas).forEach(validateSagaType)
}

function validateEpics <T extends MapObject> (epics?: T) {
  if (!epics) {
    return
  }
  Object.keys(epics).forEach(validateString)
  Object.values(epics).forEach(validateEpicType)

}

function validateSetDucks (setDucks?: Function) {
  if (setDucks) {
    assert.strictEqual(typeof setDucks, 'function', 'setDucks should be a function')
    assert.strictEqual(setDucks.length, 1, 'setDucks() should take 1 argument for the Ducks instance')
  }
}

/**
 *
 * Helper Functions
 *
 */
function validateString (value: any) {
  assert.strictEqual(typeof value, 'string', 'should be string type: ' + value)
}

function validateActionType (actionCreator: ActionCreator<AnyAction>) {
  if (typeof actionCreator === 'object') {
    for (const [key, val] of Object.entries(actionCreator)) {
      // .cancel will be undefined when not defined.
      if (key === 'cancel' && !val) {
        continue
      }
      assertAsyncKey(key)
      assertFunction(val)
    }
  } else {
    assertFunction(actionCreator)
  }

  function assertFunction (creator: any) {
    assert.strictEqual(typeof creator, 'function', 'actionCreator is expected to be a function, but we got: ' + typeof creator + ', ' + String(creator))
  }

  function assertAsyncKey (key: string) {
    const ASYNC_KEY_LIST = [
      'request',
      'success',
      'failure',
      'cancel',
    ]
    assert(ASYNC_KEY_LIST.includes(key), 'async action creator should with object keys: request/success/failure/cancel. we got: ' + key)
  }
}

function validateSelectorType (selector: (...args: any[]) => any) {
  assert.strictEqual(typeof selector, 'function', 'selector should be a function')
}

function validateOperationType (operation: (...args: any[]) => any) {
  assert.strictEqual(typeof operation, 'function', 'operation should be a function')
}

function validateMiddlewareType (middleware: (...args: any[]) => any) {
  assert.strictEqual(typeof middleware, 'function', 'middleware should be a function')
  assert.strictEqual(middleware.length, 1, 'middleware should has 1 arguments')
  assert.match(middleware.name, /Middleware$/, 'middleware should be named as xxxMiddleware (ends with `Middleware`)')
}

function validateSagaType (saga: (...args: any[]) => any) {
  assert.strictEqual(typeof saga, 'function', 'saga should be a function')
  assert.match(saga.name, /Saga$/, 'saga should be named as xxxSaga (ends with `Saga`)')
}

function validateEpicType (epic: (...args: any[]) => any) {
  assert.strictEqual(typeof epic, 'function', 'epic should be a function')
  assert.match(epic.name, /Epic$/, 'epic should be named as xxxEpic (ends with `Epic`)')
}

export {
  validateDuck,
}
