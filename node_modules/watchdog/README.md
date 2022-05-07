# WATCHDOG

[![NPM](https://github.com/huan/watchdog/actions/workflows/npm.yml/badge.svg)](https://github.com/huan/watchdog/actions/workflows/npm.yml)
[![NPM Version](https://badge.fury.io/js/watchdog.svg)](https://badge.fury.io/js/watchdog)
[![Downloads](http://img.shields.io/npm/dm/watchdog.svg?style=flat-square)](https://npmjs.org/package/watchdog)
[![Powered by TypeScript](https://img.shields.io/badge/Powered%20By-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

A Timer used to Detect and Recover from Malfunctions.

![watchdog](https://huan.github.io/watchdog/images/watchdog.png)
> Picture Credit: [Using Watchdog Timer](https://www.logicsupply.com/explore/io-hub/tutorial-using-beaglebone-black-watchdog-timer/)

## USAGE

```shell
$ npm install watchdog
...
```

```ts
import { Watchdog } from 'watchdog'

const TIMEOUT = 1 * 1000  // 1 second
const dog = new watchdog(TIMEOUT)

const food = { data: 'delicious' }

dog.on('reset', () => console.log('reset-ed'))
dog.on('feed',  () => console.log('feed-ed'))

dog.feed(food)
// Output: feed-ed

setTimeout(function() {
  dog.sleep()
  console.log('dog sleep-ed. Demo over.')
}, TIMEOUT + 1)
// Output: reset-ed.
// Output: dog sleep-ed. Demo over.
```

## DOCUMENT

See [auto generated docs](https://huan.github.io/watchdog)

## HISTORY

### master

In developing ...

### v0.8 Jul 2018

- Support browser ([#31](https://github.com/huan/watchdog/issues/31))

### v0.0.1 Oct 2017

- Init watchdog

## SEE ALSO

- [Wikipedia: Watchdog timer](https://en.wikipedia.org/wiki/Watchdog_timer)
- [Yet Another watchdog timer for node.js (and browserify)](https://github.com/andrew-filonenko/ya-watchdog)

## THANKS

Thanks to Damon Oehlman (<https://github.com/DamonOehlman>)
who owned the `watchdog` name of NPM module.
He is so kind and nice that passed this name over to me after my request.

## AUTHOR

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

- Code & Docs © 2017-now Huan LI \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
