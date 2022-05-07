# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## 10.0.0

Legacy range options have been removed ([Level/community#86](https://github.com/Level/community/issues/86)). If you previously did:

```js
codec.encodeLtgt({ start: 'a', end: 'z' })
```

An error would now be thrown and you must instead do:

```js
codec.encodeLtgt({ gte: 'a', lte: 'z' })
```

This release also drops support of legacy runtime environments ([Level/community#98](https://github.com/Level/community/issues/98)):

- Node.js 6 and 8
- Internet Explorer 11
- Safari 9-11
- Stock Android browser (AOSP).

## 9.0.0

Dropped node 0.12, 4, 5 and 7.

## 8.0.0

Previously the "utf8" decoder always returned a string. This was a workaround for `encoding-down` that is no longer needed. The return type now depends on the `asBuffer` option, which is more optimal.

## 7.0.0

Dropped node 0.10 and iojs.

## 6.0.0

The `createDecodeStream()` method (introduced in the last 5.x version) has been replaced with `createStreamDecoder()`.

## 5.0.0

This is a rewrite of both internals and the public API. Please see the README for details.

## 4.0.0

Removed default encoding ("utf8"). If you relied on this behavior you must now define it yourself.

## 3.0.0

Removed the `encoding` option in favor of `keyEncoding` and `valueEncoding`. Note: it was partially restored in v6.1.0.

## 2.0.0

The function signature of `batch()` has changed from `batch(ops, batchOptions, dbOptions)` to `batch(ops, optionObjects)`.
