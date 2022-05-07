# wechaty-redux

[![NPM Version](https://img.shields.io/npm/v/wechaty-redux?color=brightgreen)](https://www.npmjs.com/package/wechaty-redux)
[![NPM](https://github.com/wechaty/wechaty-redux/workflows/NPM/badge.svg)](https://github.com/wechaty/wechaty-redux/actions?query=workflow%3ANPM)
[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)
[![Powered by Ducks](https://img.shields.io/badge/Powered%20by-Ducks-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

Wrap Wechaty with Redux Actions &amp; Reducers for Easy State Management

[![Wechaty Redux](docs/images/wechaty-redux.png)](https://github.com/wechaty/wechaty-redux)

> Image Source: [Managing your React state with Redux](https://medium.com/the-web-tub/managing-your-react-state-with-redux-affab72de4b1)

[![Downloads](https://img.shields.io/npm/dm/wechaty-redux.svg?style=flat-square)](https://www.npmjs.com/package/wechaty-redux)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

## What is Redux

[Redux](https://redux.js.org) is a Predictable State Container for JS Apps

## Why use Redux with Wechaty

To be write...

## What is Ducks

[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)

See [Ducks](https://github.com/huan/ducks)

## Usage

### Install

```sh
npm install wechaty-redux
```

### Vanilla Redux with Wechaty Redux Plugin

> Vanilla Redux means using plain Redux without any additional libraries like Ducks.

```ts
import {
  createStore,
  applyMiddleware,
}                         from 'redux'
import {
  createEpicMiddleware,
  combineEpics,
}                         from 'redux-observable'
import { WechatyBuilder }  from 'wechaty'
import {
  WechatyRedux,
  Api,
}                         from 'wechaty-redux'

/**
 * 1. Configure Store with RxJS Epic Middleware for Wechaty Ducks API
 */
const epicMiddleware = createEpicMiddleware()

const store = createStore(
  Api.default,
  applyMiddleware(epicMiddleware),
)

const rootEpic = combineEpics(...Object.values(Api.epics))
epicMiddleware.run(rootEpic)

/**
 * 2. Instanciate Wechaty and Install Redux Plugin
 */
const bot = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
bot.use(WechatyRedux({ store }))

/**
 * 3. Using Redux Store with Wechaty Ducks API!
 */
store.subscribe(() => console.info(store.getState()))

store.dispatch(Api.actions.ding(bot.puppet.id, 'dispatch a ding action'))
// The above code 👆 is exactly do the same thing with the following code 👇 :
Api.operations.ding(store.dispatch)(bot.puppet.id, 'call ding from operations')
```

### Ducks Proposal Style for Wechaty Redux Plugin

```ts
import { WechatyBuilder } from 'wechaty'
import { Ducks }          from 'ducks'
import {
  WechatyRedux,
  Api,
}                   from 'wechaty-redux'

/**
 * 1. Ducksify Wechaty Redux API
 */
const ducks = new Ducks({ wechaty: Api })
const store = ducks.configureStore()

/**
 * 2. Instanciate Wechaty with Redux Plugin
 */
const bot = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
bot.use(WechatyRedux({ store }))

/**
 * 3. Using Redux Store with Wechaty Ducks API!
 *  (With the Power of Ducks / Ducksify)
 */
const wechatyDuck = ducks.ducksify('wechaty')

store.subscribe(() => console.info(store.getState()))
wechatyDuck.operations.ding(bot.puppet.id, 'Ducksify Style ding!')
```

### Redux Actions

See: [api/actions.ts](src/api/actions.ts)

### Redux Operations

See: [api/operations.ts](src/api/operations.ts)

### Ducks Api

[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)

See: [api/index.ts](src/api/index.ts)

## API Docs

- [Paka](https://paka.dev/npm/wechaty-redux/)

## Links

### CQRS

1. [Command–query separation](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)

### Chatbot in Redux

1. [Building bots with Redux](https://blog.botframework.com/2018/04/12/building-bots-with-redux/)
1. [BotBuilder v3 Node.js bot with Redux state management](https://github.com/microsoft/BotFramework-Samples/tree/master/blog-samples/Node/Blog-Redux-Bot)
1. [🐺 Declarative development for state driven dynamic prompt flow](https://github.com/wolf-packs/wolf-core)
1. [Botbuilder Redux Middleware](https://github.com/howlowck/botbuilder-redux)
1. [Botbuilder Redux Common Package](https://github.com/howlowck/botbuilder-redux-common)

### Redux Tools

1. [Redux DevTools](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools)
1. [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools)
1. [Using Redux DevTools in production](https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f)
1. [Video - Getting Started with Redux Dev Tools](https://egghead.io/lessons/javascript-getting-started-with-redux-dev-tools)

### Redux Talks

- [Dan Abramov - Live React: Hot Reloading with Time Travel at react-europe 2015](https://www.youtube.com/watch?v=xsSnOQynTHs)
- [Dan Abramov - The Redux Journey at react-europe 2016](https://www.youtube.com/watch?v=uvAXVMwHJXU)
- [Debugging javascript applications in production - Mihail Diordiev](https://www.youtube.com/watch?v=YU8jQ2HtqH4&feature=youtu.be)

### Redux Middleware

- [Redux Middleware](https://redux.js.org/advanced/middleware)
- [React tips — How to create a Redux Middleware Throttle](https://medium.com/@leonardobrunolima/react-tips-how-to-create-a-redux-middleware-throttle-f2908ee6f49e)

### Redux Enhancers

- [SO: Redux enhancer example](https://stackoverflow.com/a/67119838/1123955)
- [Creating a Store with Enhancers​](https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers)

## Articles

1. [Setting Up a Redux Project With Create-React-App](https://medium.com/backticks-tildes/setting-up-a-redux-project-with-create-react-app-e363ab2329b8)
1. [Redux is half of a pattern](https://dev.to/davidkpiano/redux-is-half-of-a-pattern-1-2-1hd7)

## Useful Modules

1. [redux-automata - Finite state automaton for Redux.](https://github.com/mocoding-software/redux-automata)

## History

### main

### v1.20 (Mar 7, 2022)

1. Refactoring all events with breaking changes
  for better [CQRS Wechaty](https://github.com/wechaty/cqrs) support.
1. Refactoring the events name convension: from `eventName` to `EVENT_NAME`

### v1.0 (Oct 28, 2021)

Release v1.0 of Wechaty Redux (thanks [@mukaiu](https://github.com/wechaty/redux/pull/49))

### v0.5

1. Upgrade RxJS version from 6 to 7.1
1. ES Modules support

### v0.2 (Jun 2, 2020)

Initial version. Requires `wechaty@0.40` or above versions.

1. `WechatyRedux` Plugin is ready to use.
1. API follows the [Ducks](https://github.com/huan/ducks) specification.

### v0.0.1 (Apr 19, 2020)

Decide to build a Redux Plugin for Wechaty.

Related Projects:

1. [A library that exposes matrix-js-sdk state via Redux](https://github.com/lukebarnard1/matrix-redux-wrap)
1. [A library for managing network state in Redux](https://github.com/amplitude/redux-query)
1. [How to setup Redux for a REST api](https://medium.com/hackernoon/state-management-with-redux-50f3ec10c10a)
1. [Redux middleware for calling an API](https://github.com/agraboso/redux-api-middleware)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Code & Docs © 2020 Huan (李卓桓) \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
