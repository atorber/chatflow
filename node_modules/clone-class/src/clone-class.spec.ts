#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
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

import { FixtureClass } from '../tests/fixtures/fixture-class.js'

import { cloneClass }   from './clone-class.js'

test('cloneClass smoke testing', async t => {
  const EXPECTED_NUMBER1 = 1
  const EXPECTED_NUMBER2 = 2

  const NewClass1 = cloneClass(FixtureClass)
  const NewClass2 = cloneClass(FixtureClass)

  t.ok(NewClass1.prototype instanceof FixtureClass, 'should extend right')

  t.not(NewClass1, NewClass2,    'NewClass1 should different with NewClass2')
  t.not(NewClass1, FixtureClass, 'NewClass1 should different with FixtureClass')

  NewClass1.staticMethod(EXPECTED_NUMBER1)
  t.equal(NewClass1.staticNumber, EXPECTED_NUMBER1, 'should set static number to EXPECTED_NUMBER1')

  NewClass2.staticMethod(EXPECTED_NUMBER2)
  t.equal(NewClass2.staticNumber, EXPECTED_NUMBER2, 'should set static number to EXPECTED_NUMBER2')

  const nc1 = new NewClass1(EXPECTED_NUMBER1, EXPECTED_NUMBER2)
  const nc2 = new NewClass2(EXPECTED_NUMBER1, EXPECTED_NUMBER2)

  t.ok(nc1 instanceof FixtureClass, 'nc1 should instanceof FixtureClass')
  t.ok(nc1 instanceof NewClass1,    'nc1 should  instanceof NewClass1')

  t.equal(nc1.sum(), EXPECTED_NUMBER1 + EXPECTED_NUMBER1 + EXPECTED_NUMBER2, 'should sum right for 1 + 1 + 2')
  t.equal(nc2.sum(), EXPECTED_NUMBER2 + EXPECTED_NUMBER1 + EXPECTED_NUMBER2, 'should sum right for 2 + 1 + 2')
})

test('cloneClass return NewClass with Original Name', async t => {
  const NewClass = cloneClass(FixtureClass)
  t.equal(NewClass.name, FixtureClass.name, 'should clone the same name for Class')
})

test('throw error when lowercase static property initilized with defination', async t => {
  class Test {

    public static n = { mof: 42 }

  }

  t.throws(() => cloneClass(Test), 'should throw when the static property initialized with a object in defination')
})

test('permit static property start with a captial letter to be initilized with defination', async t => {
  class Test {

    public static Data = { mof: 42 }

  }

  t.doesNotThrow(() => cloneClass(Test), 'should not throw when the static property start with a captial letter that initialized with a object in defination')
})
