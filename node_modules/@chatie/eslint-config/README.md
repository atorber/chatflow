# eslint-config

[![NPM Version](https://badge.fury.io/js/%40chatie%2Feslint-config.svg)](https://www.npmjs.com/package/@chatie/eslint-config)
[![npm (tag)](https://img.shields.io/npm/v/%40chatie/eslint-config/next.svg)](https://www.npmjs.com/package/@chatie/eslint-config?activeTab=versions)
[![NPM](https://github.com/Chatie/eslint-config/workflows/NPM/badge.svg)](https://github.com/Chatie/eslint-config/actions?query=workflow%3ANPM)

ESLint Sharable Rules in TypeScript Standard Style

![ESLint Sharable Rules in TypeScript Standard Style](https://chatie.github.io/eslint-config/images/eslint-config-chatie.jpg)
> Source: [Using ESLint and Prettier in a TypeScript Project](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project)

## USAGE

1. Install `@chatie/eslint-config`

```sh
npm install --save-dev @chatie/eslint-config
```

2. It will automatically generate a `.eslintrc.js` for you (if there's no such file before)

It will contains the following content:

```js
module.exports = {
  extends: '@chatie',
}
```

### 3. You are All Set

```sh
./node_modules/.bin/eslint
```

`eslint` will work and follow the @chatie rules.

## STYLES

- [JavaScript Standard Style](https://standardjs.com)
  - [ESLint Config for JavaScript Standard Style](https://github.com/standard/eslint-config-standard)

## SEE ALSO

- [ESLint Shareable Configs](https://eslint.org/docs/developer-guide/shareable-configs)
- [Using ESLint with TypeScript in 2019](https://43081j.com/2019/02/using-eslint-with-typescript)
- [From TSLint to ESLint, or How I Learned to Lint GraphQL Code](https://artsy.github.io/blog/2019/01/29/from-tslint-to-eslint/)

### tslint -> eslint

- [Roadmap: TSLint -> ESLint #4534](https://github.com/palantir/tslint/issues/4534)
- [Roadmap: tslint-microsoft-contrib -> ESLint #876](https://github.com/microsoft/tslint-microsoft-contrib/issues/876)
- [The future of TypeScript on ESLint](https://eslint.org/blog/2019/01/future-typescript-eslint)
- [ESLint Plugin TSLint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin-tslint)

## FAQ

### 1. `vscode` not linting TypeScript files at all

Add the following config to `.vscode/settings.json` to enable linting TypeScript files:

```json
  "eslint.validate": [
    "javascript",
    "typescript",
  ],
```

## HISTORY

### main v1.0 (Oct 20, 2021)

1. Sep 18: Clean TSLint...

### v0.14

1. Enforce Common JS ([#54](https://github.com/Chatie/eslint-config/issues/54))
1. Upgrade ESLint

### v0.11 (Jun 30, 2020)

1. Update dependencies to latest.
1. Support `Nullish coalescing operator (??)`

### v0.6 (08 Jun, 2019)

1. Add rule [no-floating-promises](https://github.com/typescript-eslint/typescript-eslint/pull/495)
1. Add rule set (recommended) from [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise)
1. Add dependence of [file-name-linter](https://npmjs.com/package/file-name-linter) to lint file names.
1. Add dependence of [markdownlint-cli](https://npmjs.com/package/markdownlint-cli) to lint markdown.
1. Auto generate `.eslintrc.js` in the project root directory after install if it not exists.
1. First beta

### v0.0.1 (07 Jun 2019)

1. Converted tsling.json to .eslintrc.js with the JavaScript Standard Style.

## AUTHOR

[Huan LI (李卓桓)](http://linkedin.com/in/zixia) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

- Code & Docs © 2019 - now Huan LI zixia@zixia.net
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
