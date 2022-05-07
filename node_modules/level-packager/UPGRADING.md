# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## 6.0.0

Legacy range options have been removed ([Level/community#86](https://github.com/Level/community/issues/86)). If you previously did:

```js
db.createReadStream({ start: 'a', end: 'z' })
```

An error would now be thrown and you must instead do:

```js
db.createReadStream({ gte: 'a', lte: 'z' })
```

The same applies to `db.iterator()`, `db.createKeyStream()` and `db.createValueStream()`.

This release also drops support of legacy runtime environments ([Level/community#98](https://github.com/Level/community/issues/98)):

- Node.js 6 and 8
- Internet Explorer 11
- Safari 9-11
- Stock Android browser (AOSP).

Lastly, in browsers, `process.nextTick()` has been replaced with [`queue-microtask`](https://github.com/feross/queue-microtask), except in streams. In the future we might use `queueMicrotask()` in Node.js too.

## 5.0.0

Upgraded to [`levelup@4`](https://github.com/Level/levelup/blob/v4.0.0/UPGRADING.md#v4) and [`encoding-down@6`](https://github.com/Level/encoding-down/blob/v6.0.0/UPGRADING.md#v6). We recommend to pair `level-packager@5` only with a store based on `abstract-leveldown` >= 6. Please follow the earlier links for more information.

## 4.0.0

The `test.js` file was rewritten to test the `level-packager` api and is no longer part of the api. Implementations based on `level-packager` should instead use the tests in the `abstract/` folder.

## 3.0.0

Dropped support for node 4. No other breaking changes.
