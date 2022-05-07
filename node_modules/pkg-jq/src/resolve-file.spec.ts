#!/usr/bin/env ts-node

import test  from 'tstest'

import path from 'path'

import { resolveFile } from './resolve-file'

test('non-exist path', async (t) => {
  const PATH = '/fdasfadsfasa/b/c'

  try {
    await resolveFile(PATH)
    t.fail('should not run to here')
  } catch (e) {
    t.pass('should throw when path not exist')
  }
})

test('non-exist file', async (t) => {
  const PATH = '/afdsafdasfasa/b/c/non-exist.json'

  try {
    await resolveFile(PATH)
    t.fail('should not run to here')
  } catch (e) {
    t.pass('should throw whenfile not exist')
  }
})

test('exist json file', async (t) => {
  const PATH = path.join(__dirname, '../tests/fixtures/test.json')
  const EXPECTED_FILE = PATH

  const file = await resolveFile(PATH)
  t.equal(file, EXPECTED_FILE, 'should resolve to the json file as input')
})

test('exist path', async (t) => {
  const PATH = path.join(__dirname, '../tests/fixtures/')
  const EXPECTED_FILE = path.join(PATH, 'package.json')

  const file = await resolveFile(PATH)
  t.equal(file, EXPECTED_FILE, 'should resolve to the package.json')
})
