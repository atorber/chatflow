#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { FixtureClass }     from '../tests/fixtures/fixture-class.js'

import { instanceToClass }  from './instance-to-class.js'

test('instanceToClass smoke testing', async t => {
  const instance = new FixtureClass(1, 2)
  const SameFixtureClass = instanceToClass(instance, FixtureClass)
  t.equal(SameFixtureClass, FixtureClass, 'should get back the same Class for its own instance')

  class ChildFixtureClass extends FixtureClass {}
  const anotherInstance = new ChildFixtureClass(3, 4)
  const AnotherFixtureClass = instanceToClass(anotherInstance, FixtureClass)
  t.not(AnotherFixtureClass, FixtureClass, 'should get back another Class for instance from its child class')
})
