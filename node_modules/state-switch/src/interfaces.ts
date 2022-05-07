import type { Loggable } from 'brolog'

import type { StateSwitch }   from './state-switch.js'
import type { BusyIndicator } from './busy-indicator.js'
import type { ServiceCtl }    from './service-ctl/service-ctl.js'

interface StateSwitchInterface {
  active   : StateSwitch['active']
  inactive : StateSwitch['inactive']
  pending  : StateSwitch['pending']
  stable   : StateSwitch['stable']
}

interface BusyIndicatorInterface {
  busy : BusyIndicator['busy']
  idle : BusyIndicator['idle']
}

interface ServiceCtlInterface {
  state: StateSwitchInterface

  reset   : ServiceCtl['reset']
  start   : ServiceCtl['start']
  stop    : ServiceCtl['stop']
}

interface StateSwitchOptions {
  log?: Loggable
}

abstract class ServiceableAbstract {

  constructor (..._: any[]) {}

  /**
   * start/stop is optional:
   *  if they exists, then they will be called
   */
  start?  (..._: any[]): any {}
  stop?   (..._: any[]): any {}
  emit    (..._: any[]): any {}

}

export type {
  BusyIndicatorInterface,
  StateSwitchInterface,
  ServiceCtlInterface,
  StateSwitchOptions,
}
export {
  ServiceableAbstract,
}
