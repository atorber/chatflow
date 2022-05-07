# flash-store

<!-- markdownlint-disable MD013 -->

[![Powered by SQLite](https://img.shields.io/badge/Powered%20By-SQLite-green.svg)](https://https://www.sqlite.org/)
[![Powered by LevelDB](https://img.shields.io/badge/Powered%20By-LevelDB-green.svg)](https://leveldb.org/)
[![Powered by RocksDB](https://img.shields.io/badge/Powered%20By-RocksDB-green.svg)](https://rocksdb.org/)
[![Powered by TypeScript](https://img.shields.io/badge/Powered%20By-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

[![NPM Version](https://img.shields.io/npm/v/flash-store?color=brightgreen)](https://www.npmjs.com/package/flash-store)
[![npm (next)](https://img.shields.io/npm/v/flash-store/next.svg)](https://www.npmjs.com/package/flash-store?activeTab=versions)
[![GitHub Action](https://github.com/huan/flash-store/workflows/NPM/badge.svg)](https://github.com/huan/flash-store/actions?query=workflow%3ANPM)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Downloads](http://img.shields.io/npm/dm/flash-store.svg?style=flat-square)](https://npmjs.org/package/flash-store)
[![node](https://img.shields.io/node/v/flash-store.svg?maxAge=604800)](https://nodejs.org/)

FlashStore is Key-Value persistent storage with easy to use ES6 Map-like API(both Async and Sync support), powered by LevelDB and TypeScript.

![flash store](https://huan.github.io/flash-store/images/flash-store.png)

## Requirements

1. Node.js v10 or above

## Examples

Try the following command

```shell
npm install
npm run demo
```

The basic function as follows:

```ts
import { FlashStore } from 'flash-store'

const flashStore = new FlashStore('flashstore.workdir')

await flashStore.set(1, 'a')
console.log(`key: 1, value: ${await flashStore.get(1)}`)
// Output: 'a'

await flashStore.del(1)
console.log(`key: 1, value: ${await flashStore.get(1)}`)
// Output: undefined
```

## Supported Backend

| Backend | Flash Store | Install NPM Command |
| :--- | :--- | :--- |
| LevelDB |v1.0 | `npm install flash-store@1` |
| SQLite | v0.20 | `npm install flash-store@0.20` |
| Medea | v0.18 | ~~npm install flash-store@0.18~~ (deprecated) |
| SnapDB | v0.16 | ~~npm install flash-store@0.16~~ (deprecated) |
| RocksDB | v0.14 | `npm install flash-store@0.14` |
| LevelDB |v0.12 | `npm install flash-store@0.12` |

> SnapDB & Medea were all deprecated because of lots of unknown bugs.

## API Reference

### `FlashStore`

FlashStore implements the Standard ES6 Map API with Async modification, powered by [async-map-like](https://github.com/huan/async-map-like)

```ts
/**
 * ES6 Map API with Async
 */
export interface AsyncMap<K = any, V = any> {
  [Symbol.asyncIterator]() : AsyncIterableIterator<[K, V]>
  size                     : Promise<number>

  clear   ()                 : Promise<void>
  delete  (key: K)           : Promise<void>
  entries()                  : AsyncIterableIterator<[K, V]>
  get     (key: K)           : Promise<V | undefined>
  has     (key: K)           : Promise<boolean>
  keys    ()                 : AsyncIterableIterator<K>
  set     (key: K, value: V) : Promise<void>
  values  ()                 : AsyncIterableIterator<V>
}

class FlashStore<K, V> implements AsyncMap<K, V> {}
```

### `FlashStoreSync`

FlashStoreSync implements the Standard ES6 Map API:

```ts
class FlashStoreSync<K, V> implements Map<K, V> {}
```

1. You get a sync API at the cost of all your data have to be kept in memory.
1. The data will be async writing back to disk for persistent storage in background.
1. The performance of `FlashStoreSync` can be expected high because it's all in memory.

## Document

See [auto generated docs](https://huan.github.io/flash-store)

* [ECMAScript 6: Maps - 2ality – JavaScript and more](http://2ality.com/2015/01/es6-maps-sets.html)

## See Also

1. [Node.js databases: an embedded database using LevelDB](https://blog.yld.io/2016/10/24/node-js-databases-an-embedded-database-using-leveldb)
2. [How to Cook a Graph Database in a Night - LevelGraph](http://nodejsconfit.levelgraph.io/)
3. [Graph database JS style for Node.js and the Browser. Built upon LevelUp and LevelDB.](https://github.com/levelgraph/levelgraph)
4. [浅析 BigTable 和 LevelDB 的实现](http://draveness.me/bigtable-leveldb.html)

## Known Issues

1. The `gte` and `lte` in `options` do not work property. ([#4](https://github.com/huan/flash-store/issues/4))

## Version History

### master v1.3 (Sep 12, 2021)

1. ES Modules support ([#93](https://github.com/huan/flash-store/pull/93))
1. Remove default `workdir` in `FlashStore` constructor.

### v1.0 (Aug 16, 2021) LevelDB v7.0

[![Powered by LevelDB](https://img.shields.io/badge/Powered%20By-LevelDB-green.svg)](https://www.npmjs.com/package/level)

LevelDB v7.0.0 support.

### v0.20 Apr 2020 SQLite as Backend

1. We hardcoded the key type to be `string` only in this version.
1. We decide to try [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) as it claim is very fast.
1. The other alternates (would love to try in the future if necessary):
    1. TypeScript: [sqlite](https://www.npmjs.com/package/sqlite)
    1. WebAssembly: [sql.js](https://www.npmjs.com/package/sql.js)

### ~~v0.18 Feb 2019 - Medea as Backend~~

[![Powered by Medea](https://img.shields.io/badge/Powered%20By-Medea-green.svg)](https://www.npmjs.com/package/medeadown)

DEPRECATED: Due to [#79](https://github.com/huan/flash-store/issues/79) [#74](https://github.com/huan/flash-store/issues/74) and also it is very unstable in production as my experiences. (e.g. memory leak & block event loop)

1. Switch from SnapDB to [MedeaDown](https://github.com/medea/medeadown)

[Medea](https://github.com/medea/medea) is a persistent key-value storage library that runs everywhere Node runs.

> "It is a pure JS implementation of leveldown and it's almost as fast."
> &mdash; @Raynos [link](https://github.com/medea/medeadown/issues/2#issue-38431966)  
>  
> "The LevelDOWN-compatible wrapper for Medea really opens up the possibility to reuse the modules that have already been created around the LevelUP ecosystem."
> &mdash; @kevinswiber [link](https://github.com/medea/medeadown/issues/2#issuecomment-49785861)

Known Issues: [FlashStore 会写满磁盘的问题 #155](https://github.com/wechaty/wechaty-puppet-padplus/issues/155)

```ts
async function compact (store: FlashStore): Promise<void> {
  await store.size
  const db = (store as any).levelDb.db.db.db
  await new Promise((resolve, reject) => {
    db.compact((err: any) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
```

### v0.16 May 2019 - SnapDB as Backend

[![Powered by SnapDB](https://img.shields.io/badge/Powered%20By-SnapDB-green.svg)](https://www.npmjs.com/package/snap-db)

1. Switch from RocksDB to [SnapDB](https://github.com/ClickSimply/snap-db) [#45](https://github.com/huan/flash-store/issues/45)
1. [#50](https://github.com/huan/flash-store/issues/50) has been fixed. ~~WARN: Do not use this version because it has known issues~~

### v0.14 May 2019 - RocksDB as Backend

1. Switch from LevelDB to [RocksDB](https://www.npmjs.com/package/rocksdb) [#34](https://github.com/huan/flash-store/issues/34)

### v0.12 Jan 2019 - LevelDB as Backend

1. Use [LevelDB](https://github.com/level/leveldown) as backend to skip the compiling when install.
1. Using leveldb official typings from `@types/`

### v0.7 Aug 2018 - Nosql-LevelDB as Backend

1. Use [nosql-leveldb](https://github.com/snowyu/node-nosql-leveldb) as backend to prevent segfault.

### v0.6 Jul 2018

1. Upgrade to TypeScript 3.0

### v0.4 Jun 2018

#### 1. Refactor API to implement ES6 `Map` interface

1. Update the API to ES6 `Map`-like, the difference is that FlashStore is all **async**.

#### 2. Add `FlashStoreSync` as a in-memory **Write-back Cache** for Flash-Store

Add a new class `FlashStoreSync` which is a in-memory full loaded **Write-back Cache** for Flash-Store:

1. Writes directly to `cache`, lazy writes to `store`.
1. Reads from cache, never read-miss because cache have the full data of the store which will never expire.
1. API of `FlashStoreSync` is the same as the ES6 `Map`

### v0.2 Sep 2017

Init version, API is LevelDB-like.

## FAQ

### Q: What's the difference between the `flash-store` and `memory-card`

Short answer:

1. `flash-store` is for save data to local filesystem.
1. `memory-card` is for save data to a distributed network storage, it can be serialized/deserialized safely with the minimum payload transfered by design.

Long answer:

`flash-store` and `memory-card` are all built by @huan, and they are all follow the ES6 Map API.

`flash-store` is using a no-sql local file database to maximum the performance, it can be used as a local database, or a local cache for whatever you want to cache from other API.

`memory-card` is using a local file to store data in JSON format by default, however, it supports more distributed methods and it can be serialized/deserialized safely with the minimum payload for transfer the data between networks (for example, it can serialize itself to only include the `redis` config and then deserialize it to restore a MemoryCard instance with the same data backend). Learn more from it's repository at [here](https://github.com/huan/memory-card)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Code & Docs © 2017-now Huan (李卓桓) \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
