# level-packager

> `levelup` package helper for distributing with an `abstract-leveldown` store.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/level-packager.svg)](https://www.npmjs.com/package/level-packager)
[![Node version](https://img.shields.io/node/v/level-packager.svg)](https://www.npmjs.com/package/level-packager)
[![Test](https://img.shields.io/github/workflow/status/Level/packager/Test?label=test)](https://github.com/Level/packager/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/codecov/c/github/Level/packager?label=&logo=codecov&logoColor=fff)](https://codecov.io/gh/Level/packager)
[![Standard](https://img.shields.io/badge/standard-informational?logo=javascript&logoColor=fff)](https://standardjs.com)
[![Common Changelog](https://common-changelog.org/badge.svg)](https://common-changelog.org)
[![Donate](https://img.shields.io/badge/donate-orange?logo=open-collective&logoColor=fff)](https://opencollective.com/level)

## API

Exports a single function which takes a single argument, an `abstract-leveldown` compatible storage back-end for [`levelup`](https://github.com/Level/levelup). The function returns a constructor function that will bundle `levelup` with the given `abstract-leveldown` replacement. The full API is supported, including optional functions, `destroy()`, and `repair()`. Encoding functionality is provided by [`encoding-down`](https://github.com/Level/encoding-down).

The constructor function has a `.errors` property which provides access to the different error types from [`level-errors`](https://github.com/Level/errors#api).

For example use-cases, see:

- [`level`](https://github.com/Level/level)
- [`level-mem`](https://github.com/Level/level-mem)
- [`level-hyper`](https://github.com/Level/level-hyper)
- [`level-lmdb`](https://github.com/Level/level-lmdb)

Also available is a _test.js_ file that can be used to verify that the user-package works as expected.

_If you are upgrading: please see [`UPGRADING.md`](UPGRADING.md)._

## Contributing

[`Level/packager`](https://github.com/Level/packager) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

Support us with a monthly donation on [Open Collective](https://opencollective.com/level) and help us continue our work.

## License

[MIT](LICENSE)

[level-badge]: https://leveljs.org/img/badge.svg
