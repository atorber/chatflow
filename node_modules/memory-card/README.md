# MEMORY CARD

[![NPM Version](https://img.shields.io/npm/v/memory-card?color=brightgreen)](https://www.npmjs.com/package/memory-card)
[![npm (next)](https://img.shields.io/npm/v/memory-card/next.svg)](https://www.npmjs.com/package/memory-card?activeTab=versions)
[![GitHub Action](https://github.com/huan/memory-card/workflows/NPM/badge.svg)](https://github.com/huan/memory-card/actions?query=workflow%3ANPM)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

Memory Card is an Easy to Use Key/Value Store, with Swagger API Backend &amp; Serialization Support.

- It is design for using in distribution scenarios.
- It is NOT design for performance.

![Memory Card](https://huan.github.io/memory-card/images/memory-card-logo.png)

## API

```ts
/**
 * ES6 Map like Async API
 */
export interface AsyncMapLike<K = any, V = any> {
  size: Promise<number>

  [Symbol.asyncIterator](): AsyncIterableIterator<[K, V]>
  entries()                  : AsyncIterableIterator<[K, V]>
  keys    ()                 : AsyncIterableIterator<K>
  values  ()                 : AsyncIterableIterator<V>

  get     (key: K)           : Promise<V | undefined>
  set     (key: K, value: V) : Promise<void>
  has     (key: K)           : Promise<boolean>
  delete  (key: K)           : Promise<void>
  clear   ()                 : Promise<void>
}

export class MemoryCard implements AsyncMapLike { ... }
```

> `MemoryCard` is an [AsyncMapLike](https://github.com/huan/async-map-like) interface

### 1. load()

### 2. save()

### 3. destroy()

### 4. multiplex()

## TODO

1. Swagger API Backend Support
1. toJSON Serializable with Metadata

## CHANGELOG

### master v1.1 (Nov 27, 2021)

1. Fix [#39](https://github.com/huan/memory-card/issues/39) by update [AsyncMapLike](https://github.com/huan/async-map-like) to v1.0

### v1.0 (Nov 10, 2021)

1. Release v1.0
1. ES Module support

### v0.13 (Aug, 2021)

1. Move S3 & OBS to peer dependency to reduce install size
1. Add Etcd Storage support

### v0.6 master (Aug 2018)

1. Support AWS S3 Cloud Storage

### v0.4 July 2018

1. Add `multiplex()` method to Multiplex MemoryStore to sub-MemoryStores.

### v0.2 June 2018

1. Unit Testing
1. NPM Pack Testing
1. DevOps to NPM with `@next` tag support for developing branch

### v0.0 May 31st, 2018

1. Promote `Profile` of Wechaty to SOLO NPM Module: `MemoryCard`
1. Update the API to ES6 `Map`-like, the difference is that MemoryCard is all **Async**.

## AUTHOR

[Huan LI](http://linkedin.com/in/zixia) \<zixia@zixia.net\>

<a href="http://stackoverflow.com/users/1123955/zixia">
  <img src="http://stackoverflow.com/users/flair/1123955.png" width="208" height="58" alt="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers" title="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers">
</a>

## COPYRIGHT & LICENSE

- Code & Docs © 2017-now Huan LI \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
