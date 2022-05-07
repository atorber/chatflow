# BROLOG

[![npm version](https://badge.fury.io/js/brolog.svg)](https://badge.fury.io/js/brolog)
[![NPM](https://github.com/huan/brolog/workflows/NPM/badge.svg)](https://github.com/huan/brolog/actions?query=workflow%3ANPM)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

![Brolog](https://huan.github.io/brolog/images/brolog-logo.png)

Brolog is Logger for Angular in Browser like Npmlog.

## FEATURE

1. Out-of-Box Browser Support.(with `<script src='//unpkg.com/brolog'></script>`)
1. Out-of-Box Angular & SystemJS Support.(See: [brolog-angular-demo project](https://github.com/huan/brolog-angular-demo))
1. Npmlog compatible interface.(i.e. `log.verbose('Brolog', 'Hello, %s', 'world!'')`)
1. Native TypeScript Support.(With typings)
1. Node.js Support.([Node.js example](https://github.com/huan/brolog/blob/master/example/npm-like-logger.js))
1. Support show **real** line number in browser console.
    > What I really get frustrated by is that I cannot wrap console.* and preserve line numbers
    >
    [We enabled this in Chrome DevTools via blackboxing a bit ago.](https://gist.github.com/paulirish/c307a5a585ddbcc17242)

### Loggable Interface

Brolog implementes [Loggable](https://github.com/huan/brolog/blob/main/src/loggable.ts):

```ts
interface Loggable {
  error   (moduleName: string, message: string, ...args: any[]): void
  warn    (moduleName: string, message: string, ...args: any[]): void
  info    (moduleName: string, message: string, ...args: any[]): void
  verbose (moduleName: string, message: string, ...args: any[]): void
  silly   (moduleName: string, message: string, ...args: any[]): void
}
```

You can import and use it by:

```ts
import { Loggable } from 'brolog'
```

## EXAMPLE

Here's two example:

1. First example to demo easy to use in browser, and how it looks like npmlog.
1. Second example to demo integrate with angular DI & SystemJS.

### 1. Super Easy to use in Browser

You can enable Brolog in your page by simple add the following `script` tag.

```html
<script src="//unpkg.com/brolog"></script>
```

```html
<html>
  <head>
    <script src="//unpkg.com/brolog"></script>
  </head>
  <body>
    <h1>Brolog in Browser Demo</h1>
    <script>

      var log = Brolog.instance('verbose')

      log.info('Test', '123 info message')
      log.verbose('Test', '123 verbose message')
      log.silly('Test', '123 silly message(should not appear)')

    </script>
  </body>
</html>
```

Link: [Brolog Live demo](http://huan.github.io/brolog)

### 2. Quick Setup to use in Angular

`Brolog` is written mainly for act as a logger with Angular. Here's how to Inject Brolog in Angular.

1. install brolog

  ```shell
  $ npm install brolog --save
  ...
  ```

1. setup SystemJS

  ```ts
  System.config({
    map: {
      brolog: 'node_modules/brolog/bundles/brolog.js'
    }
  })
  ```

1. import

  ```ts
  import { Brolog } from 'brolog'
  ```

1. inject to @NgModule

  ```ts
  providers: [
    Brolog,
  ]
  ```

1. inject to constructor

  ```ts
  class LogApp {
    constructor(
      private log: Brolog
    ) {}
  }
  ```

1. log

  ```ts
  class LogApp {
    testLog() {
      this.log.verbose('Brolog', 'test log:%s', 123)
      // this will log to browser console
    }
  }
  ```

More details, please see the `brolog-angular-demo` git repository at [here](https://github.com/huan/brolog-angular-demo).

Link: [Brolog ♥ Angular Live demo](http://huan.github.io/brolog)

## BASIC USAGE

Get a _out-of-the-box_ `log` instance to use it directly.

```ts
import { log } from 'brolog'
```

If fhe environment variable `BROLOG_LEVEL` is set, that will be used to set log.level() for the global Brolog instance `log`.

### log.{error,warn,info,verbose,silly}

```ts
import { Brolog } from 'brolog'

const log = new Brolog()

// additional stuff ---------------------------+
// message ----------+                         |
// prefix ----+      |                         |
// level -+   |      |                         |
//        v   v      v                         v
    log.info('fyi', 'I have a kitty cat: %j', myKittyCat)
```

### log.level(newLevel)

* {String} 'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'silly'

The level to display logs at.  Any logs at or above this level will be
displayed.  The special level `silent` will prevent anything from being
displayed ever.

### log\[level](prefix, message, ...)

* `level` {String} The level to emit the message at
* `prefix` {String} A string prefix.  Set to "" to skip.
* `message...` Arguments to `util.format`

Emit a log message at the specified level.

For example,

* log.silly(prefix, message, ...)
* log.verbose(prefix, message, ...)
* log.info(prefix, message, ...)
* log.warn(prefix, message, ...)
* log.error(prefix, message, ...)

### Environment Variable: `BROLOG_PREFIX`

Example:

1. Shell

    ```sh
    BROLOG_PREFIX="(Contact|Puppet)" node wechaty.js
    ```

2. This will equals to set by code API:

    ```ts
    log.prefix(/^(Contact|Puppet)$/)
    ```

## TEST

Brolog comes with well test suit to ensure the behavior is expected.

### Unit Test

```shell
$ npm run unit
...
```

Unite Test Suite: [link](https://github.com/huan/brolog/tree/master/src/brolog.spec.ts)

### End to End Test

```shell
$ npm run e2e
...
```

End to End Test Suite: [link](https://github.com/huan/brolog/tree/master/tests/e2e)

P.S. running E2E test is based on *brolog demo project*: [git repository](https://github.com/huan/brolog-angular-demo)

## CHANGELOG

### main v1.13 (Oct 27, 2021)

1. ES Module support
1. export `Loggable` interface

### v1.12 (Jun 18, 2020)

1. Update to use Chatie DevOps toolsets.
1. Upgrade TypeScript, ESLint, RollUp, etc.
1. Enable GitHub Actions.

### v1.6 (May 28th, 2018)

1. Fix browser broken problem caused by the `rollup` behavior change. ([#69](https://github.com/huan/brolog/issues/69))
1. Node.js: Add environment variable `BROLOG_PREFIX` to set the `prefix` filter of global `log` instance.
1. Browser: Add URL parameter variable `BROLOG_PREFIX` to set the `prefix` filter of global `log` instance.

### v1.4 (May 2018)

1. Continuous Deployment to `brolog@next` when the minor version in SemVer is _odd_(development release).
1. Node.js: Add environment variable `BROLOG_LEVEL` to set the loglevel of global `log` instance.
1. Browser: Add URL parameter variable `BROLOG_LEVEL` to set the loglevel of global `log` instance.

### v1.2 (Sep 2017)

1. Add `Brolog.enableLogging()` method for:
    1. `false` for disable logging
    1. `true` for enable logging
    1. `printTextFunc: (text: string)` for enable logging to a function.
1. Support for creating individual instances.(We only have one singleton instance before)

### v1.0 (Apr 2017)

Compatible with AOT & WebPack with Angular v4

1. Rewrite from JavaScript to TypeScript
1. Add UMD/AMD/System Module support
1. Add a new method: `enableLogging()` to get/set logger

### v0.4 (Mar 2017)

1. added timestamp to log output
1. fix CI back to work
1. added CD to auto deploy source code to NPM after passed CI

### v0.3.7 (Aug 2016)

1. added End to End test with Angular
1. supported include by `script` tag
1. full support unpkg.com

### v0.2.0 (Jul 16 2016)

1. added Unit Test
1. supported Angular Dependency Injection

### v0.1.0 (Jul 14 2016)

1. supported show real line number by set blackbox
1. added TypeScript definition file
1. supported work with SystemJS & Angular

## REFERENCE

1. [JavaScript Modules & Build Tools - YouTube](https://www.youtube.com/watch?v=U4ja6HeBm6s)
1. [Writing Declaration Files](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)
1. [Angular Dependency injection tokens](https://angular.io/docs/ts/latest/guide/dependency-injection.html#!#token)
1. [Angular 2 Errors](https://daveceddia.com/angular-2-errors/)
1. [ES6 vs ES2015 - What to call a JavaScript version?](https://bytearcher.com/articles/es6-vs-es2015-name/)

## AUTHOR

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

* Code & Docs © 2017 Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
