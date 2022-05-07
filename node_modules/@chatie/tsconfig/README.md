# tsconfig

[![NPM Version](https://badge.fury.io/js/%40chatie%2Ftsconfig.svg)](https://www.npmjs.com/package/@chatie/tsconfig)
[![npm (tag)](https://img.shields.io/npm/v/%40chatie/tsconfig/next.svg)](https://www.npmjs.com/package/@chatie/tsconfig?activeTab=versions)
[![Build Status](https://travis-ci.com/Chatie/tsconfig.svg?branch=master)](https://travis-ci.com/Chatie/tsconfig)


![tsconfig.json](https://chatie.github.io/tsconfig/images/typescript-tsconfig-json.jpg)

> Picture: [What is tsconfig.json](https://www.kunal-chowdhury.com/2018/05/typescript-tutorial-tsconfig-json.html)

Reusable TypeScript configuration files to extend from.  

This module enables other module to inheritance tsconfig.json via Node.js packages

## USAGE

Extends from `@chatie/tsconfig` from your tsconfig.json, to have the chatie version of the TypeScript Configuration.

It aim the following goals:

1. Support the latest `esnext` ECMAScript
1. Targeting for `ES6`
1. Strict for everything
1. Aiming for Convenience, including the `esModuleInterop` and `resolveJsonModule` etc.

### CAUTION

Do not put any directory related configurations into this module.
Only put directory related configurations to the consumer of this module.

Because all directory in tsconfig.json is related to the curfrent directory.

## SEE ALSO

- [TypeScript 3.2 - tsconfig.json inheritance via Node.js packages](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#tsconfigjson-inheritance-via-nodejs-packages)

> TypeScript 3.2 now resolves tsconfig.jsons from node_modules. When using a bare path for the "extends" field in tsconfig.json, TypeScript will dive into node_modules packages for us.
> 
> ```json
> {
>     "extends": "@my-team/tsconfig-base",
>     "include": ["./**/*"]
>     "compilerOptions": {
>         // Override certain options on a project-by-project basis.
>         "strictBindCallApply": false,
>     }
> }
> ```
>
> Here, TypeScript will climb up node_modules folders looking for a @my-team/tsconfig-base package. For each of those packages, TypeScript will first check whether package.json contains a "tsconfig" field, and if it does, TypeScript will try to load a configuration file from that field. If neither exists, TypeScript will try to read from a tsconfig.json at the root. This is similar to the lookup process for .js files in packages that Node uses, and the .d.ts lookup process that TypeScript already uses.
>
> This feature can be extremely useful for bigger organizations, or projects with lots of distributed dependencies.
>

## DEPENDENCES

This module will run a unit test before it could be able to publish to NPM.

The unit test load tsconfig schema from [JSON Schema Store](http://schemastore.org/) and then use [is-my-json-valid](https://www.npmjs.com/package/is-my-json-valid) to validate it.

## HISTORY

### master

### v4.6 (Nov 27, 2021)

Speed up `ts-node` with Rust TypeScript runtime.

1. add `ts-node.transpileOnly: true`
1. add `ts-node.transpiler: "ts-node/transpilers/swc-experimental"`

### v1.0 (Oct 24, 2021)

#### Major changes

1. Default ES Modules: `"module": "es2020"`
1. Default `"target": "es2020"`
1. TypeScript version 4.4

#### Minor changes

1. Add `"isolatedModules": true`
1. Add `"importsNotUsedAsValues": "error"`
1. Add `"moduleResolution": "node"`

See: [Intro to the TSConfig Reference:](https://www.typescriptlang.org/tsconfig)

### v0.10 Apr 2020

1. Add `dom` to `lib` in tsconfig.json

### v0.6 June 08 2019

1. Auto generate `tsconfig.json` in project root directory after install if it not exists.

### v0.4 May 14 2019

1. Only publish `tsconfig.json` to NPM to prevent strange bugs
1. Create a tsconfig base setting module for sharing across projects

## AUTHOR

[Huan LI (李卓桓)](http://linkedin.com/in/zixia) <zixia@zixia.net>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

- Code & Docs © 2019 - now Huan LI <zixia@zixia.net>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
