#!/usr/bin/env ts-node

import fs     from 'fs'
import path   from 'path'
import util   from 'util'

import test   from 'blue-tape'
import glob   from 'glob'

import { CLIEngine } from 'eslint'

// const ESLINTRC_YAML = path.join(__dirname, '.eslintrc.yaml')

const cli = new CLIEngine({
  configFile: '.eslintrc.yaml',
})

const ANTI_PATTERNS_DIR = path.join(__dirname, 'anti-patterns')
const GOOD_PATTERNS_DIR = path.join(__dirname, 'good-patterns')

test('Should fail linting for anti-patterns/**/*.ts', async t => {
  const antiPatternFilenameList = await util.promisify(glob)(`${ANTI_PATTERNS_DIR}/**/*.ts`)
  t.ok(antiPatternFilenameList.length > 0, 'should get at least 1 anti pattern file')

  for (const antiPatternFilename of antiPatternFilenameList) {
    const fileContents = fs.readFileSync(antiPatternFilename, 'utf8')
    const report       = cli.executeOnText(fileContents, antiPatternFilename)

    const baseName = path.basename(antiPatternFilename)

    if (report.errorCount > 0) {
      const ruleId = report.results[0].messages[0].ruleId
      const message = report.results[0].messages[0].message
      t.pass(`${baseName}: ${ruleId}: ${message}`)
    } else {
      t.fail(`${baseName}: error detection failed`)
    }
  }
})

test('Should pass linting for good-patterns/**/*.ts', async t => {
  const goodPatternFilenameList = await util.promisify(glob)(`${GOOD_PATTERNS_DIR}/**/*.ts`)
  t.ok(goodPatternFilenameList.length > 0, 'should get at least 1 good pattern file')

  for (const goodPatternFilename of goodPatternFilenameList) {
    const fileContents = fs.readFileSync(goodPatternFilename, 'utf8')
    const report       = cli.executeOnText(fileContents, goodPatternFilename)

    const baseName = path.basename(goodPatternFilename)

    if (report.errorCount === 0) {
      t.pass(`${baseName}: good pattern source codes is good`)
    } else {
      t.fail(`${baseName}: good pattern source codes mis-detected as bad`)
    }
  }
})
