# GError

[![NPM Version](https://badge.fury.io/js/gerror.svg)](https://badge.fury.io/js/gerror)
[![NPM](https://github.com/huan/gerror/workflows/NPM/badge.svg)](https://github.com/huan/gerror/actions?query=workflow%3ANPM)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

Mixer of gRPC Error &amp; ECMAScript Error

![GError](docs/images/gerror-logo.png)

## Motivation

We are writing async programs with gRPC with Node.js(ECMAScript) so we need to mix gRPC Error &amp; ECMAScript Error.

In order to make it easy, we build GError module

## Features

1. `GError.from(anyting: any)`
1. `gerror.toJSON()`

## Examples

TBW

## API Reference

### `class GError`

`GError` can be used to replace the standard `Error` as a drop in replacement.

```ts
import { GError } from 'gerror'

const gerror = GError.from(new Error('test'))
```

### `GError.stringify(e: any)`

Convert anything to a `JSON.stringify()`-ed `GError` payload

```ts
GError.stringify('this is a string error')

// It acepts any type of args
GError.stringify(new Error() as unknown)
```

### `wrapAsyncError()`

It has been designed to convert a Async to Sync, for example:

1. `async (...args: any[]) => Promise<any>` will be converted to `(...args: any[]) => void`
1. `Promise<any>` will be converted to `void`

The error will be send via the `onError` callback.

```ts
import { wrapAsyncError } from 'gerror'

const onError = (e: any) => console.error(e)
const wrapAsync = wrapAsyncError(onError)

const asyncFunc = async () => Promise.reject('rejection')
const syncFunc = wrapAsync(asyncFunc)
// ReturnType<typeof syncFunc> === 'void'

asyncFunc() // <- nothing happens (no unhandled rejections)
// console.error('Rejection')
```

## Resources

1. [Google Cloud APIs - Errors](https://cloud.google.com/apis/design/errors)

## History

### master v1.0 (Oct 30, 2021)

1. Initial code from `wechaty-puppet` module
1. Add `timeoutPromise()` function

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), Google Developer Export (GDE), zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Docs released under Creative Commons
* Code released under the Apache-2.0 License
* Code & Docs © 2021 Huan LI \<zixia@zixia.net\>
