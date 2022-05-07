#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import type {
  StateSwitchInterface,
  BusyIndicatorInterface,
}                         from './interfaces.js'
import { StateSwitch } from './state-switch.js'

import { test } from 'tstest'
import { BusyIndicator } from './busy-indicator.js'

test('StateSwitchInterface', async t => {
  const ss: StateSwitchInterface = new StateSwitch()
  t.ok(typeof ss, 'should no typing error')
})

test('BusyIndicatorInterface', async t => {
  const bi: BusyIndicatorInterface = new BusyIndicator()
  t.ok(typeof bi, 'should no typing error')
})
