import {
  RunHelpers,
  TestScheduler,
}                     from 'rxjs/testing'

import type { TestClass } from './tap.js'

const testSchedulerRunner = (callback: (helpers: RunHelpers) => void) => async (t: TestClass) => {
  const testScheduler = new TestScheduler((actual, expected) => {
    t.equal(actual.length, expected.length, `should be the same number of events from actual(${actual.length}) and expected(${expected.length})`)

    /**
     * Huan(202203): the test must contains at least one events
     */
    t.ok(actual.length >= 1, 'should be at least one marble event in the stream for testing')

    for (let i = 0; i < actual.length; i++) {
      t.same(actual[i], expected[i], `the marbals of actual is ${actual[i].frame}/${actual[i].notification.kind}:${JSON.stringify(actual[i].notification.value)}`)
    }
  })
  testScheduler.run(callback)
}

export {
  testSchedulerRunner,
}
