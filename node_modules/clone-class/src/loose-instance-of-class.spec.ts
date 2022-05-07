#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
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
import {
  test,
  AssertEqual,
}               from 'tstest'

import { FileBox } from 'file-box'

import type { Constructor }     from './constructor.js'
import { looseInstanceOfClass } from './loose-instance-of-class.js'

test('looseInstanceOfClass: instanceof', async t => {
  class Test {}
  const looseInstanceOfTest = looseInstanceOfClass(Test)
  const test = new Test()
  t.ok(looseInstanceOfTest(test), 'should be true for a real Test')
})

test('looseInstanceOfClass: constructor.name', async t => {
  class Test {}
  const looseInstanceOfTest = looseInstanceOfClass(Test)

  const OrigTest = Test
  t.equal(Test, OrigTest, 'should be the same class reference at beginning')

  {
    class Test {}
    t.not(OrigTest, Test, 'should has a new Test class different to the original Test class')
    const f = new Test()
    t.ok(looseInstanceOfTest(f), 'should be true for the same name class like Test')
  }

})

test('looseInstanceOfClass: n/a', async t => {
  class Test {}
  const looseInstanceOfTest = looseInstanceOfClass(Test)

  const FIXTURES = [
    {},
    undefined,
    [],
    null,
    0,
    NaN,
    true,
    false,
    new Date(),
    new Error(),
    new Map(),
    new Set(),
    new WeakMap(),
  ]

  for (const fixture of FIXTURES) {
    t.notOk(looseInstanceOfTest(fixture), `should be false for ${typeof fixture}: "${fixture}"`)
  }
})

test('looseInstanceOfClass for FileBox', async t => {
  const f = FileBox.fromQRCode('test')
  const looseInstanceOfFileBox = looseInstanceOfClass(FileBox as any as FileBox & { new (...args: any): FileBox })

  const OrigFileBox = FileBox
  {
    class FileBox {}
    t.not(OrigFileBox, FileBox, 'should be two different FileBox class')

    t.ok(f instanceof OrigFileBox, 'should be instanceof OrigFileBox')
    t.notOk(f instanceof FileBox, 'should not instanceof another FileBox class for one FileBox instance')
    t.ok(looseInstanceOfFileBox(f), 'should be true for looseInstanceOfFileBox because the class has the same name')
  }
})

test('looseInstanceOfClass for child class', async t => {
  class Test {}
  class ChildTest extends Test {}
  const looseInstanceOfTest = looseInstanceOfClass(Test)

  const c = new ChildTest()
  t.ok(looseInstanceOfTest(c), 'should be true for looseInstanceOfTest for the child class insteance')
})

test('looseInstanceOfClass for two same name parent class, with a child class', async t => {
  class Puppet {}
  const OrigPuppet = Puppet
  const looseInstanceOfPuppet = looseInstanceOfClass(OrigPuppet)

  {
    class Puppet {}
    class ChildPuppet extends Puppet {}

    const c = new ChildPuppet()
    t.notOk(c instanceof OrigPuppet, 'c is not a Puppet instance')
    t.ok(looseInstanceOfPuppet(c), 'should be true for looseInstanceOfPuppet for the child class instance to another parent class')
  }
})

test('looseInstanceOfClass for private constructor', async t => {
  class PrivateConstructorClass {

    static create () { return new PrivateConstructorClass() }
    private constructor () {}

  }

  const looseInstanceOfPrivateConstructorClass = looseInstanceOfClass(
    PrivateConstructorClass as any as Constructor<PrivateConstructorClass >,
  )
  const instance = PrivateConstructorClass.create()

  t.ok(looseInstanceOfPrivateConstructorClass(instance), 'should be able to use private constructor class as parameter')
})

test('looseInstanceOfClass for abstract class', async t => {
  abstract class AbstractClass {}

  class ChildClass extends AbstractClass {}

  const looseInstanceOfAbstractClass = looseInstanceOfClass(
    AbstractClass as any as Constructor<AbstractClass>,
  )
  const instance = new ChildClass()

  t.ok(looseInstanceOfAbstractClass(instance), 'should be able to use abstract class as parameter')
})

test('looseInstanceOfClass for type guard', async t => {
  const box: string | FileBox = {} as any

  const looseInstanceOfFileBox = looseInstanceOfClass(
    FileBox as any as Constructor<FileBox>,
  )
  const typeTest1: AssertEqual<
    typeof looseInstanceOfFileBox,
    (o: any) => o is FileBox
  > = true

  t.ok(typeTest1, 'should get looseInstanceOfFileBox type guard')

  if (looseInstanceOfFileBox(box)) {

    const typeTest2: AssertEqual<
      typeof box,
      FileBox
    > = true

    t.ok(typeTest2, 'should get FileBox type guard')

  } else {

    const typeTest3: AssertEqual<
      typeof box,
      string
    > = true

    t.ok(typeTest3, 'should get string type guard')

  }
})
