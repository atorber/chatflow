# RX-QUEUE

[![NPM](https://github.com/huan/rx-queue/actions/workflows/npm.yml/badge.svg)](https://github.com/huan/rx-queue/actions/workflows/npm.yml)
[![Windows Build status](https://img.shields.io/appveyor/ci/zixia/rx-queue/master.svg?label=Windows)](https://ci.appveyor.com/project/zixia/rx-queue)
[![NPM Version](https://badge.fury.io/js/rx-queue.svg)](https://badge.fury.io/js/rx-queue)
[![Downloads](http://img.shields.io/npm/dm/rx-queue.svg?style=flat-square)](https://npmjs.org/package/rx-queue)
[![Powered by TypeScript](https://img.shields.io/badge/Powered%20By-TypeScript-blue.svg)](https://www.typescriptlang.org/)

Easy to Use ReactiveX Queue that Supports Delay/DelayExecutor/Throttle/Debounce Features Powered by RxJS.

![RxQueue](https://huan.github.io/rx-queue/images/queue.png)
> Picture Credit: [Queues in JavaScript](https://www.kirupa.com/html5/queues_in_javascript.htm)

## API

### Class

1. [RxQueue](#rxqueue)
1. [DelayQueue](#delayqueue)
1. [ThrottleQueue](#throttlequeue)
1. [DebounceQueue](#debouncequeue)
1. [DelayQueueExecutor](#DelayQueueExecutor)

### Function

1. [concurrencyExecuter()](#concurrencyexecuter)

### RxQueue

`RxQueue` is the base class of all other queues. It extends from RxJS Subject.

**Example:**

```ts
import { RxQueue } from 'rx-queue'

const queue = new RxQueue()
queue.next(1)
queue.next(2)
queue.next(3)

queue.subscribe(console.log)
// Output: 1
// Output: 2
// Output: 3
```

### DelayQueue

`DelayQueue` passes all the items and add delays between items.

![DelayQueue](https://huan.github.io/rx-queue/images/delay.png)
> Picture Credit: [ReactiveX Single Operator Delay](http://reactivex.io/documentation/single.html)

Practical examples of `DelayQueue`:

1. We are calling a HTTP API which can only be called no more than ten times per second, or it will throw a `500` error.

**Example:**

```ts
import { DelayQueue } from 'rx-queue'

const delay = new DelayQueue(500)  // set delay period time to 500 milliseconds
delay.subscribe(console.log)

delay.next(1)
delay.next(2)
delay.next(3)

// Output: 1
// Paused 500 millisecond...
// Output: 2
// Paused 500 millisecond...
// Output: 3
```

### ThrottleQueue

`ThrottleQueue` passes one item and then drop all the following items in a period of time.

![ThrottleQueue](https://huan.github.io/rx-queue/images/throttle.png)
> Picture Credit: [ReactiveX Observable Throttle](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttle)

By using throttle, we don't allow to our queue to pass more than once every X milliseconds.

Practical examples of `ThrottleQueue`:

1. User is typing text in a textarea. We want to call auto-save function when user is typing, and want it only run at most once every five minutes.

**Example:**

```ts
import { ThrottleQueue } from 'rx-queue'

const throttle = new ThrottleQueue(500)  // set period time to 500 milliseconds
throttle.subscribe(console.log)

throttle.next(1)
throttle.next(2)
throttle.next(3)

// Output: 1
```

### DebounceQueue

`DebounceQueue` drops a item if there's another one comes in a period of time.

![DebounceQueue](https://huan.github.io/rx-queue/images/debounce.png)
> Picture Credit: [ReactiveX Observable Debounce](http://reactivex.io/documentation/operators/debounce.html)

The Debounce technique allow us to deal with multiple sequential items in a time period to only keep the last one.

Debouncing enforces that no more items will be passed again until a certain amount of time has passed without any new items coming.

Practical examples of `DebounceQueue`:

1. User is typing text in a search box. We want to make an auto-complete function call only after the user stop typing for 500 milliseconds.

**Example:**

```ts
import { DebounceQueue } from 'rx-queue'

const debounce = new DebounceQueue(500)  // set period time to 500 milliseconds
debounce.subscribe(console.log)

debounce.next(1)
debounce.next(2)
debounce.next(3)

// Paused 500 millisecond...
// Output: 3
```

### DelayQueueExecutor

`DelayQueueExecutor` calls functions one by one with a delay time period between calls.

> If you want this feature but do not want rxjs dependencies, you can have a look on a zero dependencies alternative: [BottleNeck](https://github.com/SGrondin/bottleneck）

![DelayQueueExecutor](https://huan.github.io/rx-queue/images/delay.png)
> Picture Credit: [ReactiveX Single Operator Delay](http://reactivex.io/documentation/single.html)

Practical examples of `DelayQueueExecutor`:

1. We are calling a HTTP API which can only be called no more than ten times per second, or it will throw a `500` error.

**Example:**

```ts
import { DelayQueueExecutor } from 'rx-queue'

const delay = new DelayQueueExecutor(500)  // set delay period time to 500 milliseconds

delay.execute(() => console.log(1))
delay.execute(() => console.log(2))
delay.execute(() => console.log(3))

// Output: 1
// Paused 500 millisecond...
// Output: 2
// Paused 500 millisecond...
// Output: 3
```

### `concurrencyExecuter()`

When we have a array and need to use an async function to get the result of them, we can use `Promise.all()`:

```ts
const asyncTask = async function (item) {
  /**
   * Some heavy task, like:
   *  1. requires XXX MB of memory
   *  2. make 10+ new network connections and each takes 10+ seconds
   *  3. etc.
   */
}

const result = await Promise.all(
  hugeArray.map(item => asyncTask),
)
```

Because the above example `asyncTask` requires lots of resource for each task,
so if the `hugeArray` has many items, like 1,000+,
then to use the `Promise.all` will very likely to crash the system.

The solution is that we can use `concurrencyExecuter()` to execute them in parallel with a concurrency limitation.

```ts
// async task:
const heavyTask = (n: number) => Promise.resolve(resolve => setTimeout(resolve(n^2), 100))

const results = concurrencyExecuter(
  2,          // concurrency
)(
  heavyTask,  // task async function
)(
  [1, 2, 3],  // task arguments
)

/**
 * in the following `for` loop, we will have 2 currency tasks running at the same time.
 */
for await (const result of results) {
  console.log(result)
}
```

That's it.

## SEE ALSO

* [Writing Marble Tests](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md)

## CHANGELOG

### main v1.0 (Nov 23, 2021)

1. ES Module Support
1. TypeScript 4.5
1. `concurrencyExecuter()` method added

### v0.12 - May 2021

1. Upgrade RxJS to v7.1
1. Upgrade TypeScript to v4.3
1. Fix RxJS breaking changes [#71](https://github.com/huan/rx-queue/issues/71)

### v0.8 - Mar 2019

1. Fix typo: issue [#40](https://github.com/huan/rx-queue/issues/40) - rename `DelayQueueExector` to `DelayQueueExecutor`

### v0.6 - Sep 2018

1. fix exception bug in browser(ie. Angular)

### v0.4 - May 2018

1. Upgrade to RxJS 6
1. Moved CI from Travis-ci.org  to Travis-ci.com

### v0.2 - Oct 30, 2017

1. Support: `DelayQueue`, `ThrottleQueue`, `DebounceQueue`, `DelayQueueExecutor`.
1. first version

## AUTHOR

[Huan LI (李卓桓)](http://linkedin.com/in/zixia) \<zixia@zixia.net\>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

* Code & Docs © 2017-now Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
