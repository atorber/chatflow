#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}               from 'tstest'

import { FixtureClass } from '../tests/fixtures/fixture-class.js'

import type {
  Constructor,
  // constructor,
}                   from './constructor.js'

test('Constructor<TYPE> smoke testing', async t => {
  type TYPE = typeof FixtureClass & Constructor<FixtureClass>
  type PROTOTYPE = TYPE['prototype']

  /**
   * Make sure that `PROTOTYPE` is equal to `typeof FixtureClass`
   * See also: https://stackoverflow.com/a/50116912/1123955
   */
  const instance: PROTOTYPE = new FixtureClass(1, 2)

  t.equal(instance.sum(), 3, 'should sum right for 1 + 2')
})

test('Constructor<T> with private constructor class', async t => {
  /**
   * Issue #55
   *  https://github.com/huan/clone-class/issues/55
   */
  class PrivateConstructorClass {

    private constructor () {}

  }

  const C = PrivateConstructorClass as any as Constructor<PrivateConstructorClass>

  const c = new C()
  t.ok(c, 'should be able to instanciate')

  const typeTest: AssertEqual<typeof c, PrivateConstructorClass> = true
  t.ok(typeTest, 'should be same after constructor')
})

/**
 * Huan(202110): TypeError: Cannot read property 'valueDeclaration' of undefined #58
 *  https://github.com/huan/clone-class/issues/58
 */
test('class with static methods', async t => {
  class StaticMethodClass {

    static staticMethod () {}
    protected constructor () {}

  }

  const C: typeof StaticMethodClass = StaticMethodClass as any as Constructor<StaticMethodClass, typeof StaticMethodClass>
  t.ok(C, 'should be ok')
})

test('Constructor with default generic setting', async t => {
  type C = Constructor
  const typeTest: AssertEqual<C, Constructor> = true
  t.ok(typeTest, 'should be ok without generic settings "<...>"')
})
