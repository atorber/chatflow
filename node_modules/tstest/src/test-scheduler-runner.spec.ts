#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { throttleTime } from 'rxjs'

import { test }                 from './tap.js'
import { testSchedulerRunner }  from './test-scheduler-runner.js'

test('RxJS testSchedulerRunner: throttleTime demo testing', testSchedulerRunner(helpers => {
  const time = 200
  const operation = throttleTime(time, undefined, { trailing: true })
  const actual   = 'abcdef'
  const expected = '200ms f'

  helpers.expectObservable(
    helpers.cold(actual).pipe(operation),
  ).toBe(expected)
}))

test('RxJS testSchedulerRunner: fail with event number mismatch', async t => {
  await t.rejects(testSchedulerRunner(helpers => {
    const actual   = '-'
    const expected = '-x'

    helpers.expectObservable(
      helpers.hot(actual),
    ).toBe(expected)
  }), 'should reject when the actual & expected event number is not match')
})

test('RxJS testSchedulerRunner: fail with 0 events', async t => {
  await t.rejects(testSchedulerRunner(helpers => {
    const actual   = '-'
    const expected = '-'

    helpers.expectObservable(
      helpers.hot(actual),
    ).toBe(expected)
  }), 'should reject when there is no events in the stream')
})
