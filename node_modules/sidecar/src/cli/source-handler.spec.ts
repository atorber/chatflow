#!/usr/bin/env -S node --no-warnings --loader ts-node/esm --experimental-vm-modules
import { test }  from 'tstest'

import fs from 'fs'
import path from 'path'

import stringSimilarity from 'string-similarity'

import {
  sourceHandler,
}                     from './source-handler.js'
import { codeRoot }   from '../cjs.js'

test('sourceHandler()', async t => {
  const CLASS_FILE = path.join(
    codeRoot,
    'examples',
    'chatbox-sidecar.ts',
  )
  const FIXTURE_FILE = path.join(
    codeRoot,
    'tests',
    'fixtures',
    'sidecar-dump.source.chatbox-sidecar.js.fixture',
  )

  const normalize = (text: string) => text
    /**
     * Strip file path line for CI under Linux & Windows
     */
    .replace(/^.*chatbox.*$/gm, '')
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/^ +$/gm, '')  // remove spaces in empty line
    .replace(/\r/g, '')     // Windows will add \r, which need to be removed for comparing
    .replace(/\n+$/s, '')   // strip all the ending newlines

  const FIXTURE = await fs
    .readFileSync(FIXTURE_FILE)
    .toString()

  const source = await sourceHandler({ file: CLASS_FILE })
  // console.info('source:', source)

  /**
   * Generate the testing fixture file, Huan(202107)
   *
   *  When we have updated the examples/chatbox-sidecar.ts file,
   *  we need to update the `tests/fixtures/sidecar-dump.source.chatbox-sidecar.js.fixture`
   *  so that the unit testing can be match the updated frida agent source code.
   */
  // fs.writeFileSync('t.js', source)

  /**
   * We remove all spaces in the file so that the comparision will ignore all spaces
   */
  const normalizedSource  = normalize(source)
  const normalizedFixture = normalize(FIXTURE)

  /**
   * String Similarity Comparision in JS with Examples
   *  https://sumn2u.medium.com/string-similarity-comparision-in-js-with-examples-4bae35f13968
   */
  const similarity = stringSimilarity.compareTwoStrings(
    normalizedFixture,
    normalizedSource,
  )

  void normalizedSource
  void normalizedFixture
  // console.log('normalizedSource:', normalizedSource)
  // console.log('####################')
  // console.log('normalizedFixture:', normalizedFixture)
  // console.log('###:', normalizedSource.length)

  const THRESHOLD = 0.95
  const ok = similarity > THRESHOLD
  // console.log('similarity:', similarity)

  t.ok(ok, `should get the source from ts file with similarity(${Math.floor(similarity * 100)}%) > ${THRESHOLD * 100}%`)
})
