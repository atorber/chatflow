<h1 align="center">
  <p>@pipeletteio/nop</p>
</h1>

<p align="center">A simple nop (no-op) function helper. Nop is a function that does nothing.</p>

<p align="center">
  <a alt="Build Status" href="https://github.com/pipeletteio/nop/actions?query=workflow">
    <img src="https://github.com/pipeletteio/nop/workflows/Build/badge.svg"/>
  </a>
  <a alt="Npm version" href="https://www.npmjs.com/package/@pipeletteio/nop?activeTab=versions">
    <img src="https://img.shields.io/npm/v/@pipeletteio/nop.svg?longCache=true&logo=npm">
  </a>
  <a alt="CodeClimate coverage" href="https://codeclimate.com/github/pipeletteio/nop/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/0dd2d5bb4e76e524531e/test_coverage"/>
  </a>
  <a alt="CodeClimate maintainability" href="https://codeclimate.com/github/pipeletteio/nop/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/0dd2d5bb4e76e524531e/maintainability"/>
  </a>
  <a alt="Node requierement version" href="https://github.com/pipeletteio/nop/blob/master/package.json">
    <img src="https://img.shields.io/node/v/@pipeletteio/nop.svg?longCache=true"/>
  </a>
</p>

## Installation
```bash
npm install @pipeletteio/nop
```

## Example

```javascript
import { nop, isNop } from '@pipeletteio/nop';
// const { nop, isNop } = require('@pipeletteio/nop');

isNop(nop); // => true

isNop(function () {}); // => false
```

## Docs
Read [documentation](https://pipeletteio.github.io/nop) for more informations.

## API

#### nop

The nop function which will be used to replace the non cancellable callables.

|   argument   |    type   | details |
|--------------|-----------|---------|
|    ...arg    |   any[]   | ...     |

Return void.

#### isNop

Check if the argument is the nop function.

|   argument   |    type   |         details          |
|--------------|-----------|--------------------------|
|      arg     |    any    | The checked argument.    |

Return a boolean.
