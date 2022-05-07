<!-- markdownlint disable: MD033 -->
# STATE-SWITCH

[![npm version](https://badge.fury.io/js/state-switch.svg)](https://badge.fury.io/js/state-switch)
[![NPM](https://github.com/huan/state-switch/workflows/NPM/badge.svg)](https://github.com/huan/state-switch/actions?query=workflow%3ANPM)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

![State Switch Logo](https://huan.github.io/state-switch/images/state-switch.gif)

State Switch is a Monitor/Guard for Managing Your Async Operations.

## Introduction

`StateSwitch` can manage state transition for you, by switching from the following four states:

1. `INACTIVE`: state is inactive
1. `pending ACTIVE`: state is switching from INACTIVE to ACTIVE
1. `ACTIVE`: state is active
1. `pending INACTIVE`: state is switch from ACTIVE to INACTIVE

You can set/get the state with the API, and you can also monite the state switch events by listening the 'active' and 'inactive' events.

There have another `stable()` API return a `Promise` so that you can wait the `active` of `inactive` events by:

```ts
await state.stable('active')
await state.stable('inactive')
await state.stable() // wait the current state
```

If the state is already ACTIVE when you `await state.stable('active')`, then it will resolved immediatelly.

## EXAMPLE

Talk is cheap, show me the code!

### Code

```ts
import { StateSwitch } from 'state-switch'

function doSlowConnect() {
  console.log('> doSlowConnect() started')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('> doSlowConnect() done')
      resolve()
    }, 1000)
  })
}

function doSlowDisconnect() {
  console.log('> doSlowDisconnect() started')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('> doSlowDisconnect() done')
      resolve()
    }, 1000)
  })
}

class MyConnection {
  private state = new StateSwitch('MyConnection')

  constructor() {
    /* */
  }

  public connect() {
    /**
     * This is the only 1 Right State
     */
    if (this.state.inactive() === true) {
      this.state.active('pending')

      doSlowConnect().then(() => {
        this.state.active(true)
        console.log(`> I'm now opened`)
      })

      console.log(`> I'm opening`)
      return
    }

    /**
     * These are the other 3 Error States
     */
    if (this.state.inactive() === 'pending') {
      console.error(`> I'm closing, please wait`)
    } else if (this.state.active() === true) {
      console.error(`> I'm already open. no need to connect again`)
    } else if (this.state.active() === 'pending') {
      console.error(`> I'm opening, please wait`)
    }
  }

  public disconnect() {
    /**
     * This is the only one Right State
     */
    if (this.state.active() === true) {
      this.state.inactive('pending')

      doSlowDisconnect().then(() => {
        this.state.inactive(true)
        console.log(`> I'm closed.`)
      })

      console.log(`> I'm closing`)
      return
    }

    /**
     * These are the other 3 Error States
     */
    if (this.state.active() === 'pending') {
      console.error(`> I'm opening, please wait`)
    } else if (this.state.inactive() === true) {
      console.error(`> I'm already close. no need to disconnect again`)
    } else if (this.state.inactive() === 'pending') {
      console.error(`> I'm closing, please wait`)
    }
  }
}

const conn = new MyConnection()

console.log('CALL: conn.connect(): should start to opening')
conn.connect()

console.log('CALL: conn.connect(): should not connect again while opening')
conn.connect()

console.log('CALL: conn.disconnect(): can not disconnect while opening')
conn.disconnect()

setTimeout(() => {
  console.log('... 2 seconds later, should be already open  ...')

  console.log('CALL: conn.connect(): should not connect again if we are open')
  conn.connect()

  console.log('CALL: conn.disconnect(): should start to closing')
  conn.disconnect()

  console.log('CALL: conn.disconnect(): should not disconnect again while we are closing')
  conn.disconnect()

  console.log('CALL: conn.connect(): can not do connect while we are closing')
  conn.connect()

  setTimeout(() => {
    console.log('... 2 seconds later, should be already closed ...')

    console.log('CALL: conn.disconnect(): should not disconnect again if we are close')
    conn.disconnect()
  }, 2000)

}, 2000)

```

### Diagram

What's the meaning of the above code?

StateSwitch helps you manage the following four states easy:

![State Switch Diagram](https://huan.github.io/state-switch/images/state-switch-diagram.png)

### Run

```shell
$ npm run demo

> state-switch@0.1.3 demo /home/zixia/git/state-switch
> ts-node example/demo

CALL: conn.connect(): should start to opening
> doSlowConnect() started
> I'm opening
CALL: conn.connect(): should not connect again while opening
> I'm opening, please wait
CALL: conn.disconnect(): can not disconnect while opening
> I'm opening, please wait
> doSlowConnect() done
> I'm now opened
... 2 seconds later, should be already open  ...
CALL: conn.connect(): should not connect again if we are open
> I'm already open. no need to connect again
CALL: conn.disconnect(): should start to closing
> doSlowDisconnect() started
> I'm closing
CALL: conn.disconnect(): should not disconnect again while we are closing
> I'm closing, please wait
CALL: conn.connect(): can not do connect while we are closing
> I'm closing, please wait
> doSlowDisconnect() done
> I'm closed.
... 2 seconds later, should be already closed ...
CALL: conn.disconnect(): should not disconnect again if we are close
> I'm already close. no need to disconnect again

```

That's the idea: **we should always be able to know the state of our async operation**.

## API REFERENCE

Class StateSwitch

### constructor(clientName?: string)

Create a new StateSwitch instance.

```ts
private state = new StateSwitch('MyConn')
```

### active(): boolean | 'pending'

Get the state for `ACTIVE`: `true` for ACTIVE(stable), `pending` for ACTIVE(in-process). `false` for not ACTIVE.

### active(state: true | 'pending'): void

Set the state for `ACTIVE`: `true` for ACTIVE(stable), `pending` for ACTIVE(in-process).

### inactive(): boolean | 'pending'

Get the state for `INACTIVE`: `true` for INACTIVE(stable), `pending` for INACTIVE(in-process). `false` for not INACTIVE.

### inactive(state: true | 'pending'): void

Set the state for `INACTIVE`: `true` for INACTIVE(stable), `pending` for INACTIVE(in-process).

### pending(): boolean

Check if the state is `pending`.

`true` means there's some async operations we need to wait.
`false` means no async active fly.

### `stable(expectedState?: StateType, noCross=false): Promise<void>`

1. `expectedState`: `'active' | 'inactive'`, default is the current state
1. `noCross`: `boolean`, default is `false`

Wait the expected state to be stable.

If set `noCross` to `true`, then `stable()` will throw if you are wait a state from it's opposite site, for example: you can expect an `Exception` be thrown out when you call `stable('active', true)` when the `inactive() === true`.

### name(): string

Get the name from the constructor.

### setLog(logger: Loggable)

Enable log by set log to a Npmlog compatible instance.

Personaly I use Brolog, which is writen by my self, the same API with Npmlog but can also run inside Browser with Angular supported.

```ts
const log = Brolog.instance()
StateSwitch.setLog(log)
```

## `BooleanIndicator`

Set a true/false state.

```ts
const indicator = new BooleanIndicator()
```

### 1. `value(v?: boolean): void`

1. set `true` or `false`
1. get `boolean` status

```ts
indicator.value(true)
indicator.value(false)
const value = indicator.value()
```

### 2. `ready(v: boolean, noCross=false): Promise<void>`

Return a `Promise` that will resolved after the boolean state to be the value passed through `v`.

> If the current boolean state is the same as the `v`, then it will return a `Promise` that will resolved immediately.

```ts
await indicator.ready(false)
assert (indicator.value() === false, 'value() should be false after await ready(false)')
```

## ServiceCtl Interface

```ts
interface ServiceCtlInterface {
  state: StateSwitchInterface

  reset   : ServiceCtl['reset']
  start   : ServiceCtl['start']
  stop    : ServiceCtl['stop']
}
```

### ServiceCtlFsm (ServiceCtlFsmMixin) Class

Use a Finite State Machine (FSM) to manage the state of your service.

```ts
import { ServiceCtlFsm } from 'state-switch'

class MyService extends ServiceCtlFsm {

  async onStart (): Promise<void> {
    // your start code
  }

  async onStop (): Promise<void> {
    // your stop code
  }

}

const service = new MyService()

await service.start() // this will call `onStart()`
await service.stop()  // this will call `onStop()`

await service.start()
await service.reset()  // this will call `onStop()` then `onStart()`
```

Learn more about the finite state machine design pattern inside our `ServiceCtl`:

[![State Switch Service Controler](https://stately.ai/registry/machines/37e4ce99-945d-49a8-8da2-1f324d04b574.png)](https://stately.ai/viz/37e4ce99-945d-49a8-8da2-1f324d04b574)

### ServiceCtl (ServiceCtlMixin) Class

Implementes the same `ServiceCtlInterface`, but using a `StateSwitch` to manage the internal state.

The code is originally from [Wechaty Puppet](https://github.com/wechaty/puppet/blob/e13b93335460baad0b3e5392f7eff62fef7bb645/src/puppet/puppet-abstract.ts#L139-L193), then abstracted to a class.

## RESOURCES

### XState

1. [An Introduction to XState in TypeScript](https://dev.to/giantmachines/an-introduction-to-xstate-in-typescript-1pdn)

## CHANGELOG

### master v1.7 (Jan 18, 2022)

1. Add `BooleanIndicator` class to replace and deprecate the `BusyIndicator` class for a more powerful and easy to use API.

#### v1.1 (Oct 27, 2021) - Breaking changes

1. `StateSwitch#pending` -> `StateSwitch#pending()`
1. `StateSwitch#on()` -> `StateSwitch#active()`
1. `StateSwitch#off()` -> `StateSwitch#inactive()`
1. `emit('on')` -> `emit('active')`
1. `emit('off')` -> `emit('inactive')`

TL;DR:

```diff
- state.on()
+ state.active()

- state.on(true)
+ state.active(true)

- state.off()
+ state.inactive()

- state.off(true)
+ staet.inactive(true)

- state.pending
+ state.pending()
```

### v1.0 (Oct 23, 2021)

- Oct 27: Add `ServiceCtl`/`ServiceCtlFsm` abstract class and `serviceCtlMixin`/`serviceCtlFsmMixin` mixin
- Oct 23: Add `BusyIndicator` class
    1. Add `BusyIndicatorInterface` and `StateSwitchInterface`
- v0.15 (Sep 2021): Publish as ESM package.

### v0.14

1. Add RxJS typing unit tests for making sure that the `fromEvent` typing inference is right.

### v0.9 master (Mar 2020)

Support for using RxJS:

```ts
const notPending = (state: true | 'pending') => state === true

const stateOn$ = fromEvent(stateSwitch, 'active').pipe(
  filter(notPending)
)
```

See: [RxJS - operator - fromEvent - Node.js EventEmitter: An object with addListener and removeListener methods.](https://rxjs.dev/api/index/function/fromEvent)

1. Support emit `on` and `off` events with the args of the `state` of two values: `true` and `pending`.
1. Add events unit tests

### v0.6 (Jun 2018)

1. DevOps for publishing to NPM@next for odd minor versions.
1. Add State Diagram for easy understanding what state-switch do

### v0.4 (Apr 2018)

BREAKING CHANGE: Change the `ready()` parameter to the opposite side.

- Before: `ready(state, crossWait=false)`
- AFTER: `ready(state, noCross=false`)

### v0.3 (Apr 2018)

1. add new method `ready()` to let user wait until the expected state is on(true).

### v0.2 (Oct 2017)

BREAKING CHANGES: redesigned all APIs.

1. delete all old APIs.
1. add 4 new APIs: on() / off() / pending() / name()

### v0.1.0 (May 2017)

Rename to `StateSwitch` because the name StateMonitor on npmjs.com is taken.

1. Make it a solo NPM Module. ([#466](https://github.com/Chatie/wechaty/issues/466))

### v0.0.0 (Oct 2016)

Orignal name is `StateMonitor`

1. Part of the [Wechaty](https://github.com/Chatie/wechaty) project

## AUTHOR

Huan LI <zixia@zixia.net> (<http://linkedin.com/in/zixia>)

<a href="http://stackoverflow.com/users/1123955/zixia">
  <img src="http://stackoverflow.com/users/flair/1123955.png" width="208" height="58" alt="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers" title="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers">
</a>

## COPYRIGHT & LICENSE

- Code & Docs 2016-now© zixia
- Code released under the Apache-2.0 license
- Docs released under Creative Commons
