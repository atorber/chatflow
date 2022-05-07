#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import {
  normalizeSidecarTarget,
  SidecarTargetRawSpawn,
  SidecarTargetObjSpawn,
  isSidecarTargetSpawn,
  isSidecarTargetProcess,
}                           from './target.js'

test('normalizeSidecarTarget() processTarget: number', async t => {
  const TARGET = 0x1234
  const EXPECTED = {
    target: TARGET,
    type: 'process',
  }

  const actual = normalizeSidecarTarget(TARGET)
  t.same(actual, EXPECTED, 'should normalize number to process target')

  t.ok(isSidecarTargetProcess(actual), 'should be a process target')
})

test('normalizeSidecarTarget() processTarget: string', async t => {
  const TARGET = 'namedTarget'
  const EXPECTED = {
    target: TARGET,
    type: 'process',
  }

  const actual = normalizeSidecarTarget(TARGET)
  t.same(actual, EXPECTED, 'should normalize string to process target')

  t.ok(isSidecarTargetProcess(actual), 'should be a process target')
})

test('normalizeSidecarTarget() spawnTarget: []', async t => {
  const TARGET = [
    'command',
    [
      'arg1',
      'arg2',
    ],
  ] as SidecarTargetRawSpawn
  const EXPECTED = {
    target: TARGET,
    type: 'spawn',
  }

  const actual = normalizeSidecarTarget(TARGET)
  t.same(actual, EXPECTED, 'should normalize array to spawn target')

  t.ok(isSidecarTargetSpawn(actual), 'should be a spawn target')
})

test('normalizeSidecarTarget() obj: {}', async t => {
  const TARGET = {
    target: [
      'command',
      ['arg1'],
    ],
    type: 'spawn',
  } as SidecarTargetObjSpawn

  const actual = normalizeSidecarTarget(TARGET)
  t.same(actual, TARGET, 'should normalize obj unchanged')

  t.ok(isSidecarTargetSpawn(actual), 'should be a spawn target')
})

test('normalizeSidecarTarget() undefined', async t => {
  const TARGET = undefined
  const actual = normalizeSidecarTarget(TARGET)
  t.same(actual, undefined, 'should normalize undefined to undefined')

  t.notOk(isSidecarTargetSpawn(actual), 'should not be a spawn target')
  t.notOk(isSidecarTargetProcess(actual), 'should not be a process target')
})
