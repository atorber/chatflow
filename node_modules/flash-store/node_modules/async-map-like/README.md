# async-map-like

[![NPM Version](https://img.shields.io/npm/v/async-map-like?color=brightgreen)](https://www.npmjs.com/package/async-map-like)
![NPM](https://github.com/huan/async-map-like/workflows/NPM/badge.svg)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

ECMAScript `Map` like type definition (plus Async).

[![Async ES6 Map Like TypeScript Interface](docs/images/async-es6-map.png)](https://github.com/huan/async-map-like)

It has same API Interface with [Map - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map "Map - JavaScript | MDN"), with additional **Async** support.

## Usage

```ts
import { MapLike } from 'async-map-like'

const mapLike: MapLike<string, number> = new Map<string, number>
```

That's it, enjoy the [Duck Typing](https://en.wikipedia.org/wiki/Duck_typing)!

## API Reference

```ts
/**
 * ES6 Map like Async API
 */
export interface AsyncMapLike<K = any, V = any> {

  size : Promise<number>

  get     (key: K)           : Promise<V | undefined>
  set     (key: K, value: V) : Promise<void>
  has     (key: K)           : Promise<boolean>
  delete  (key: K)           : Promise<void>
  clear   ()                 : Promise<void>

  entries () : AsyncIterableIterator<[K, V]>
  keys    () : AsyncIterableIterator<K>
  values  () : AsyncIterableIterator<V>

  [Symbol.asyncIterator]() : AsyncIterableIterator<[K, V]>

  forEach (
    callbackfn: (
      value : V,
      key   : K,
      map   : AsyncMapLike<K, V>,
    ) => void,
    thisArg?: AsyncMapLike<K, V>,
  ): Promise<void>

}
```
## History

### master

### v0.2 (July 25, 2020)

1. Create `MapLike` interface for ES6 Map
1. Create `AsyncMapLike` for ES6 Map like Async interface

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), Microsoft AI MVP, zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Docs released under Creative Commons
* Code released under the Apache-2.0 License
* Code & Docs © 2018 Huan LI \<zixia@zixia.net\>
