# ducks

[![NPM](https://github.com/huan/ducks/actions/workflows/npm.yml/badge.svg)](https://github.com/huan/ducks/actions/workflows/npm.yml)
[![NPM Version](https://img.shields.io/npm/v/ducks?color=yellow)](https://www.npmjs.com/package/ducks)
[![NPM](https://github.com/huan/ducks/workflows/NPM/badge.svg)](https://github.com/huan/ducks/actions?query=workflow%3ANPM)

🦆🦆🦆Ducks is a Reducer Bundles Manager that Implementing the Redux Ducks Modular Proposal with Great Convenience.

[![Ducks](https://huan.github.io/ducks/images/ducks.png)](https://github.com/huan/ducks)

> Image Credit: [Alamy](https://www.alamy.com/cute-duck-and-little-ducks-over-white-background-colorful-design-vector-illustration-image185379753.html)

[![Ducks Modular Proposal](https://img.shields.io/badge/Redux-Ducks%202015-yellow)](https://github.com/erikras/ducks-modular-redux)
[![Re-Ducks Extended](https://img.shields.io/badge/Redux-Re--Ducks%202016-orange)](https://github.com/alexnm/re-ducks)
[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify%202020-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)

Ducks offers a method of handling redux module packaging, installing, and running with your Redux store, with middleware support.

> Java has jars and beans. Ruby has gems. I suggest we call these reducer bundles "ducks", as in the last syllable of "redux".  
> &mdash; Erik Rasmussen, 2015 ([link](https://github.com/erikras/ducks-modular-redux#name))

## Goal

The goal of Ducks is to:

1. Organizing your code for the long term.
1. Maximum your convenience when using Redux Ducks.
1. Type-safe with strong typing with TypeScript Generic Templates.

## Features

1. Implemented the specification from [Ducks Modular Proposal, Erik Rasmussen, 2015](https://github.com/erikras/ducks-modular-redux)
1. Easy connecting ducks to store by adding one enhancer to redux. (that's all you need to do!)
1. Fully typing with all APIs by TypeScript
1. Currying `operators` and `selectors` by binding the `Store` to them for maximum convenience.

Todo-list:

- [ ] Ducks middleware support
- [ ] Provides a Ducks Management interface for adding/deleting a duck module dynamically

## Motivation

I'm building my redux ducks module for Wechaty Redux project and ...

To be written.

At last, I decide to write my own manager for ducks, which will implement the following two specifications, with my own Ducksify Extension:

1. The Ducks Modular Proposal
1. The Re-Ducks Extension: Duck Folders
1. The Ducksify Extension: Currying `selectors` and `operators`

### 1 The Ducks Modular Proposal

[![Ducks Modular Proposal](https://img.shields.io/badge/Redux-Ducks%202015-yellow)](https://github.com/erikras/ducks-modular-redux)

The specification has rules that a module:

1. MUST `export default` a function called `reducer()`
1. MUST `export` its action creators as functions
1. MUST have action types in the form `npm-module-or-app/reducer/ACTION_TYPE`
1. MAY export its action types as `UPPER_SNAKE_CASE`, if an external reducer needs to listen for them, or if it is a published reusable library

Here's the full version of Ducks proposal: [Redux Reducer Bundles, A proposal for bundling reducers, action types and actions when using Redux, Erik Rasmussen, 2015](https://github.com/erikras/ducks-modular-redux)

### 2 The Re-Ducks Extension: Duck Folders

[![Re-Ducks Extension](https://img.shields.io/badge/Redux-Re--Ducks%202016-orange)](https://github.com/alexnm/re-ducks)

`Re-Ducks` is an extension to the original proposal for the ducks redux modular architecture.

By defining a ducks with duck folders instead of a duck file, it defines the **duck** folder would like:

```sh
duck/
├── actions.js
├── index.js
├── operations.js
├── reducers.js
├── selectors.js
├── tests.js
├── types.js
├── utils.js
```

> NOTE: Each concept from your app will have a similar folder.

#### General rules for a duck folder

A duck folder:

1. MUST contain the **entire logic** for handling **only ONE** concept in your app, ex: product, cart, session, etc.
1. MUST have an `index.js` file that exports according to the original duck rules.
1. MUST keep code with similar purpose in the same file, ex: reducers, selectors, actions, etc.
1. MUST contain the **tests** related to the duck.

Here's the full version of Re-ducks proposal: [Building on the duck legacy, An attempt to extend the original proposal for redux modular architecture, Alex Moldovan, 2016](https://github.com/alexnm/re-ducks) and [blog](https://medium.com/better-programming/scaling-your-redux-app-with-ducks-6115955638be#.4ppptx7oq)

### 3 Ducksify Extension: Currying & Ducksify Interface

[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify%202020-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)

In order to build a fully modularized Ducks, we define the **Ducksify** extension with the following rules:

1. MUST export its module interface as the following `Duck` interface:

    ```ts
    export interface Duck {
      /**
       * Ducks Modular Proposal (https://github.com/erikras/ducks-modular-redux)
      */
      default: Reducer,

      actions    : ActionCreatorsMapObject,
      operations?: OperationsMapObject,
      selectors? : SelectorsMapObject,
      types?     : TypesMapObject,

      /**
       * Ducksify Extension (https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)
      */
      middlewares?: MiddlewaresMapObject,
      epics?: EpicsMapObject,
      // Disabled temporary. See: https://github.com/huan/ducks/issues/4
      // sagas?: SagasMapObject,

      setDucks?: (ducks: Ducks<any>) => void
    }
    ```

1. MUST support [Currying](https://stackoverflow.com/a/36321/1123955) the first argument for `selectors.*` with a `State` object
1. MUST support [Currying](https://stackoverflow.com/a/36321/1123955) the first argument for `operations.*` with a `Dispatch` function
1. MAY export its middlewares functions called `*Middleware()`
1. MAY export its saga functions called `*Saga()`
1. MAY export its epic functions called `*Epic()`
1. MAY use [typesafe-actions](https://github.com/piotrwitek/typesafe-actions) to creating reducers, actions, and middlewares.
1. If we has `sagas`, `epics`, or `middlewares`, the **duck** folder would like:

    ```sh
    duck/
    ├── epics.js
    ├── sagas.js
    ├── middlewares.js
    ```

## Requirements

Node.js v16+, or Browser with ES2020 Support

## Install

```sh
npm install ducks
```

## Usage

### 1 Create Redux Reducer Bundle as a `Duck`

For example, let's create a Duck module file named `counter.ts`:

```ts
export const types      = { TAP: 'ducks/examples/counter/TAP' }
export const actions    = { tap: () => ({ type: TAP }) }
export const operations = { tap: dispatch => dispatch(actions.tap()) }
export const selectors  = { getTotal: state => () => state.total }

const initialState = { total: 0 }
export default function reducer (state = initialState, action) {
  if (action.type === types.TAP) {
    return ({
      ...state,
      total: (state.total || 0) + 1,
    })
  }
  return state
}
```

### 2 Manage the Bundles with `Ducks` Manager

```ts
import { Ducks }       from 'ducks'
import * as counterDuck from './counter.js'

const ducks = new Ducks({ counter: counterDuck })
const counter = ducks.ducksify(counterDuck)
```

### 3 Configure Redux Store

```ts
import { createStore } from 'redux'

const store = createStore(
  state => state,     // Your other reducers
  ducks.enhancer(),   // Add ducks to your store (that's all you need to do!)
)
```

You are all set!

### 4 Using Ducks

The Vanilla Style and Ducksify Style is doing exactly the same thing.

#### The Vanilla Style

```ts
store.dispatch(counterApi.actions.tap())
console.info('getTotal:', counterApi.selectors.getTotal(store.getState().counter)))
// Output: getTotal: 1
```

#### The Ducksify Style

```ts
counter.operations.tap()
console.info('getTotal:', counter.selectors.getTotal()))
// Output: getTotal: 2
```

It turns out that the Ducksify Style is more clear and easy to use by currying them with the store as their first argument.

That's it!

## Examples

Let's get to know more about Ducks by **quack**!

The following is the full example which demonstrate how to use Ducks.

It shows that:

1. How to import duck modules with easy and clean way.
1. Ducks supports `redux-observable` and `redux-saga` out-of-the-box with zero configuration.
1. How to stick with the best practices to write a redux reducer bundle by following the ducks modular proposal.

### Talk is cheap, show me the code

The following example code can be found at [examples/quack.ts](examples/quack.ts), you can try it by running the following commands:

```sh
git clone git@github.com:huan/ducks.git
cd ducks

npm install
npm start
```

```ts
import { createStore } from 'redux'
import { Duck, Ducks } from 'ducks'

import * as counterDuck  from './counter.js'    // Vanilla Duck: +1
import * as dingDongDuck from './ding-dong.js'  // Observable Middleware
import * as pingPongDuck from './ping-pong.js'  // Saga Middleware
import * as switcherDuck from './switcher.js'   // Type Safe Actions: ON/OFF

const ducks = new Ducks({
  counter  : counterDuck,
  switcher : switcherDuck,
  dingDong : dingDongDuck,
  pingPong : pingPongDuck,
})

const {
  counter,
  dingDong,
  pingPong,
  switcher,
} = ducks.ducksify()

const store = createStore(
  state => state,     // Here's our normal Redux Reducer
  ducks.enhancer(),   // We use Ducks by adding this enhancer to our store, and that's it!
)

/**
 * Vanilla: Counter
 */
assert.strictEqual(counter.selectors.getCounter(), 0)
counter.operations.tap()
assert.strictEqual(counter.selectors.getCounter(), 1)

/**
 * TypeSafe Actions: Switchers
 */
assert.strictEqual(switcher.selectors.getStatus(), false)
switcher.operations.toggle()
assert.strictEqual(switcher.selectors.getStatus(), true)

/**
 * Epic Middleware: DingDong
 */
assert.strictEqual(dingDong.selectors.getDong(), 0)
dingDong.operations.ding()
assert.strictEqual(dingDong.selectors.getDong(), 1)

/**
 * Saga Middleware: PingPong
 */
assert.strictEqual(pingPong.selectors.getPong(), 0)
pingPong.operations.ping()
assert.strictEqual(pingPong.selectors.getPong(), 1)

console.info('store state:', store.getState())
```

I hope you will like this clean and beautiful `Ducksify` way with using Ducks!

## Api References

Ducks is very easy to use, because one of the goals of designing it is to maximum the convenience.

We use `Ducks` to manage `Redux Reducer Bundle`s with the `Duck` interface that following the [ducks modular proposal](https://github.com/erikras/ducks-modular-redux).

For validating your `Duck` form the redux module (a.k.a reducer bundle), we have a validating helper function `validateDuck` that accepts a `Duck` to make sure it's valid (it will throws an Error when it's not).

### 1 `Duck`

The `Duck` is a interface which is defined from the [ducks modular proposal](https://github.com/erikras/ducks-modular-redux), extended from both [Re-Ducks](https://github.com/alexnm/re-ducks) and [Ducksify](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface).

Example:

`Duck` counter example from our [examples](examples/counter/index.ts)

```ts
import * as actions     from './actions.js'
import * as operations  from './operations.js'
import * as selectors   from './selectors.js'
import * as types       from './types.js'

import reducer from './reducers.js'

export {
  actions,
  operations,
  selectors,
  types,
}

export default reducer
```

### 2 `Ducks`

The `Ducks` class is the manager for `Duck`s and connecting them to the Redux Store by providing a `enhancer()` to Redux `createStore()`.

```ts
import { Ducks } from 'ducks'
import * as counterApi from './counter.js'

const ducks = new Ducks({
  counter: counterApi,
})

const store = createStore(
  state => state,
  ducks.enhancer(),
)
// Duck will be ready to use after the store has been created.
```

There is one important thing that we need to figure out is that when we are passing the `DucksMapObject` to initialize the `Ducks` (`{ counter: counterDuck }` in the above case), the key name of this Api will become the mount point(name space) for its state.

Choose your key name wisely because it will inflect the state structure and the typing for your store.

> There's project named [Ducks++: Redux Reducer Bundles, Djamel Hassaine, 2017](https://medium.com/@DjamelH/ducks-redux-reducer-bundles-44267f080d22) to solve the mount point (namespace) problem, however, we are just use the keys in the `DucksMapObject` to archive the same goal.

#### 2.1 `Ducks#enhancer()`

Returns a `StoreEnhancer` for using with the Redux store creator, which is the most important and the only one who are in charge of initializing everything for the Ducks.

```ts
const store = createStore(
  state => state,
  ducks.enhancer(),
)
```

If you have other enhancers need to be used with the Ducks, for example, the `applyMiddleware()` enhancer from the Redux, you can use `compose()` from Redux to archive that:

```ts
import { applyMiddleware, compose, createStore } from 'redux'
import { Ducks } from 'ducks'
// ...
const store = createStore(
  state => state,
  compose(
    ducks.enhancer(),
    applyMiddleware(
      // ...
    ),
  )
)
```

> NOTE: our `enhancer()` should be put to the most left in the `compose()` argument list, because it would be better to make it to be the most outside one to be called.

#### 2.2 `Ducks#configureStore()`

If you only use Redux with Ducks without any other reducers, then you can use `configureStore()` shortcut from the Ducks to get the configured store.

```ts
const store = ducks.configureStore(preloadedStates)
```

The above code will be equals to the following naive Redux `createStore()` codes because the `configureStore()` is just a shortcut of that for our convenience.

```ts
// This is exactly what `ducks.configureStore()` does:
const store = createStore(
  state => state,
  preloadedStates,
  ducks.enhancer(),
)
```

#### 2.3 `Ducks#ducksify()`

`ducksify()` will encapsulate the `Api` into the `Bundle` class so that we will have a more convenience way to use it.

1. Return all Bundles: `const { counter } = ducks.ducksify()`
1. Return the Bundle for _namespace_: `const counter = ducks.ducksify('counter')
1. Return the Bundle for _api_: `const counter = ducks.ducksify(counterApi)

For example:

```ts
import * as counterDuck from './counter.js'

const ducks = new Ducks({ counter: counterDuck })
const store = ducks.configureStore()

// 1. Return all Bundles
const { counter } = ducks.ducksify()

// 2. Return the Bundle for namespace: `counter`
const counterByName = ducks.ducksify('counter')
assert(counterByName === counter)

// 3. Return the Bundle for api: `counterDuck`
const counterByApi = ducks.ducksify(counterDuck)
assert(counterByApi === counter)
```

Comparing the Duck with the Bundle (ducksified Duck), we will get the following differences: (`counterBundle` is the ducksified `counterDuck`)

For `selectors`:

```diff
- counterDuck.selectors.getTotal(store.getState().counter)()
+ counterBundle.selectors.getTotal()
```

For `operations`:

```diff
- counterDuck.operations.tap(store.dispatch)()
+ counterBundle.operations.tap()
```

As you see, the above differences showed that the ducksified api will give you great convenience by currying the `Store` inside itself.

### 4 `validateDuck()`

To make sure your Ducks Api is following the specification of the [ducks modular proposal](https://github.com/erikras/ducks-modular-redux), we provide a validating function to check it.

```ts
import { validateDuck } from 'ducks'
import * as counterDuck from './counter.js'

validateDuck(counterDuck) // will throw if the counterApi is invalid.
```

## Resources

- [Redux - Store enhancer](https://redux.js.org/glossary#store-enhancer)
- [Typesafe utilities designed to reduce types verbosity and complexity in Redux Architecture](https://github.com/piotrwitek/typesafe-actions)
- [Conditional Type Checks](https://github.com/dsherret/conditional-type-checks)
- [Redux Ecosystem Links - A categorized list of addon libraries for Redux, as well as other libraries that are closely related](https://github.com/markerikson/redux-ecosystem-links)

### Modular

- [Why I Chose to Modularize the Ducks in My React App // Lauren Lee // CascadiaJS 2018](https://www.youtube.com/watch?v=jr7D4VAzNig&t=960s)
- [Redux: Another implementation for Selector Pattern](https://stackoverflow.com/q/53265572/1123955)
- [Scaling your Redux App with ducks](https://www.freecodecamp.org/news/scaling-your-redux-app-with-ducks-6115955638be/)
- [Where do I put my business logic in a React-Redux application?](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1)
- [Redux Ecosystem Links - A categorized list of Redux-related addons, libraries, and utilities](https://github.com/markerikson/redux-ecosystem-links)
- [Modular Reducers and Selectors](https://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/)

### Middlewares

- [ducksMiddleware - Extract all available middleware from a ducks object and creates a middleware with all available middleware.](https://github.com/drpicox/ducks-middleware)
- [Exploring Redux middleware - Nine simple stand-alone experiments to understand Redux Middlewares](https://blog.krawaller.se/posts/exploring-redux-middleware/)
- [Redux Middleware LifeCycle - Impure and asynchronous; but still redux](https://hackernoon.com/)
- [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
- [You Aren’t Using Redux Middleware Enough](https://medium.com/@jacobp100/you-arent-using-redux-middleware-enough-94ffe991e6)
- [Idiomatic Redux: Thoughts on Thunks, Sagas, Abstraction, and Reusability](https://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/)
- [This collection of common Redux-saga patterns will make your life easier.](https://medium.com/free-code-camp/redux-saga-common-patterns-48437892e11c)
- [Lost with Redux and sagas? Implement them yourself!](https://blog.castiel.me/posts/2019-08-03-lost-redux-saga-reimplement-them/)

### Relate Libraries

1. Microsoft Redux Dynamic Modules: Modularize Redux by dynamically loading reducers and middlewares.
    - [microsoft/redux-dynamic-modules](https://github.com/microsoft/redux-dynamic-modules) is a library that aims to make Redux Reducers and middleware easy to modular-ize and add/remove dynamically.
1. [ioof-holdings/redux-dynostore - These libraries provide tools for building dynamic Redux stores.](https://github.com/ioof-holdings/redux-dynostore)
1. [reSolve - A Redux-Inspired Backend](https://medium.com/resolvejs/resolve-redux-backend-ebcfc79bbbea)
1. [redux-dynamic-middlewares - Allow add or remove redux middlewares dynamically](https://github.com/pofigizm/redux-dynamic-middlewares)

### Other Links

- [redux-operations - Solves challenging redux problems in a clean, understandable, debuggable fasion](https://github.com/mattkrick/redux-operations)
- [Dynamically inject reducers in your react reduc app. HMR and SSR compatible.](https://github.com/GuillaumeCisco/redux-reducers-injector)
- [Helper for loading sagas asynchronously using redux](https://github.com/GuillaumeCisco/redux-sagas-injector)
- [💉 inject reducer and saga anywhere in the application.](https://github.com/marcelmokos/redux-inject-reducer-and-saga)
- [Paradux - a Redux reducer wrapper that adds a little bit of fun uncertainty](https://github.com/asteridux/paradux)
- [Allows dynamically injecting reducers into a redux store at runtime](https://github.com/randallknutson/redux-injector)
- [redux-optimistic-ui - a reducer enhancer to enable type-agnostic optimistic updates](https://github.com/mattkrick/redux-optimistic-ui)
- [Reduce Reducers - Reduce multiple reducers into a single reducer from left to right](https://github.com/redux-utilities/reduce-reducers)
- [Utilities that embrace best practices while working with redux in a universal application.](https://github.com/ImmoweltGroup/redux-lumbergh)
- [createReduxDuckling() to spawn Redux Ducks as unique child instances called Ducklings.](https://github.com/sammysaglam/redux-ducklings)
- [Modular and Extensible Redux Reducer Bundles (ducks-modular-redux)](https://github.com/investtools/extensible-duck)
- [Composable ducklings](https://github.com/pghalliday/redux-duckling)
- [Factory for simple creation and use of redux ducks.](https://github.com/espen42/duckfactory)
- [tiny-duck - Composable redux reducers](https://github.com/LockedOn/tiny-duck)
- [reduxModuleCreator - RMC is a tool for creating not coupled, reusable and testable modules based on Redux.](https://github.com/mtnt/reduxModuleCreator)

## Future Thoughts

Redux Ducks Api compares with CQRS, Event Sourcing, and DDD:

| Ducks       | CQRS    | Event Sourcing | DDD  |
| :---        | :---    | :---           | :--- |
| actions     | Domain Aggregates with Command handlers
| - creator   | Command |
| - payload   | Event   | Event          |      |
| selectors   | Query   |
| operations  | Command + Event |
| middlewares | Aggregate? | Saga ? |
| types       | ??
| reducers    | Reducers to calculate Aggregate state

> [reSolve](https://reimagined.github.io/resolve/docs/introduction) is a Node.js library for Redux & CQRS

### Domain Driven Design (DDD)

Domain aggregate is a business model unit. Business logic is mostly in command handlers for the aggregate.

### Event Sourcing (ES)

Don't store system state, store events that brought system to this state.

### Command Query Responsibility Segregation (CQRS)

[CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) system is divided in two "sides":

1. Write Side accepts commands and generate events that stored in the Event Store.
1. Read Side applies events to Read Models, and process queries.

## History

### master v1.0 (Oct 29, 2021)

Release v1.0 of Redux Ducks

v0.11 (Sep 2021)

1. Disable `saga` support temporary due to ([#4](https://github.com/huan/ducks/issues/4))
1. ES Modules support

### v0.10 (Jun 6, 2020)

Add `setDucks()` to `Duck` API interface,
so that all the `Duck` can get the `Ducks` instance
(if needed, by providing a `setDucks()` method from the API),
which helps the `Duck`s talk to each others.

### v0.8 (Jun 5, 2020)

Renaming for better names with a better straightforward intuition.

1. Rename `interface Api` to `interface Duck`
1. Rename `class Duck` to `class Bundle`
1. Rename `function validateDucksApi` to `function validateDuck`

### v0.6 (Jun 1, 2020)

Refactoring the `Ducks` with better Api interface.

1. Added `ducksify()` method for get `Duck` instance by `namespace` or `api`.

### v0.4 (May 30, 2020)

Fix the TypeScript Generic Template typing problems:

1. Protect String Literal Types in Action Types [#1](https://github.com/huan/ducks/issues/1)
1. Property 'payload' is missing in type 'AnyAction' [#2](https://github.com/huan/ducks/issues/2)

### v0.2 (May, 1 2020)

1. Published the very first version of [Ducks Modular Proposal](https://github.com/erikras/ducks-modular-redux) to Ducks!

## Thanks

[@gobwas](https://github.com/gobwas) is the gentleman who owned this [ducks](https://www.npmjs.com/package/ducks) NPM module name, and he's so kind for letting me use this great NPM module name `ducks` for my project. Appreciate it!

## Badge

### Powered by Ducks

[![Powered by Ducks](https://img.shields.io/badge/Powered%20by-Ducks-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)

```md
[![Powered by Ducks](https://img.shields.io/badge/Powered%20by-Ducks-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)
```

### Ducksify

[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify%202020-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)

```md
[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify%202020-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--ducksify-interface)
```

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), Microsoft Regional Director, \<zixia@zixia.net\>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Code & Docs © 2020 Huan LI (李卓桓) \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
