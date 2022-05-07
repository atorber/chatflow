#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import fs from 'fs'
import path from 'path'

import {
  partialLookup,
}                         from './partial-lookup.js'
import { codeRoot } from '../cjs.js'

test('partialLookup()', async t => {
  const EXPECTED_STR = fs.readFileSync(path.join(
    codeRoot,
    'src',
    'agent',
    'templates/libs/log.cjs',
  ), 'utf-8')
  const source = await partialLookup('libs/log.cjs')
  t.equal(source, EXPECTED_STR, 'should get right partial file content')
})
