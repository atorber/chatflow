# is-pr

Returns `true` if the current environment is a Continuous Integration
server configured to run a PR build.

If PR detection is not supported for the current CI server, the value
will be `null`. Otherwise `false`.

Please [open an issue](https://github.com/watson/is-pr/issues) if your
CI server or PR build isn't properly detected :)

[![npm](https://img.shields.io/npm/v/is-pr.svg)](https://www.npmjs.com/package/is-pr)
[![Tests](https://github.com/watson/is-pr/workflows/Tests/badge.svg)](https://github.com/watson/is-pr/actions)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```bash
npm install is-pr --save
```

## Programmatic Usage

```js
const isPR = require('is-pr')

if (isPR) {
  console.log('The code is running on a CI server as part of a PR build')
}
```

## CLI Usage

For CLI usage you need to have the `is-pr` executable in your `PATH`.
There's a few ways to do that:

- Either install the module globally using `npm install is-pr -g`
- Or add the module as a dependency to your app in which case it can be
  used inside your package.json scripts as is
- Or provide the full path to the executable, e.g.
  `./node_modules/.bin/is-pr`

```bash
is-pr && echo "This is a PR build on a CI server"
```

## Supported CI tools

Refer to [ci-info](https://github.com/watson/ci-info#supported-ci-tools)
docs for all supported CI's

## License

[MIT](LICENSE)
