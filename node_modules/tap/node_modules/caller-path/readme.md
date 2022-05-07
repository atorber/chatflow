# caller-path

> Get the path of the caller function

**Important:** You have to use `'use strict';` in your code for this module to work correctly, or make sure the module is an ESM module, which is implicitly strict.

## Install

```
$ npm install caller-path
```

## Usage

```js
// foo.js
const callerPath = require('caller-path');

module.exports = () => {
	console.log(callerPath());
	//=> '/Users/sindresorhus/dev/unicorn/bar.js'
}
```

```js
// bar.js
const foo = require('./foo');
foo();
```

If the caller's [callsite](https://github.com/sindresorhus/callsites#api) object `getFileName` was not defined for some reason, it will return `undefined`.

## API

### callerPath(options?)

Get the path of the caller function.

##### depth

Type: `number`\
Default: `0`

The caller path depth, meaning how many levels we follow back on the stack trace.

For example:

```js
// foo.js
const callerPath = require('caller-path');

module.exports = () => {
	console.log(callerPath());
	//=> '/Users/sindresorhus/dev/unicorn/foobar.js'
	console.log(callerPath({depth: 1}));
	//=> '/Users/sindresorhus/dev/unicorn/bar.js'
	console.log(callerPath({depth: 2}));
	//=> '/Users/sindresorhus/dev/unicorn/foo.js'
}
```

```js
// bar.js
const foo = require('./foo');

module.exports = () => {
	foo();
}
```

```js
// foobar.js
const bar = require('./bar');
bar();
```

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-caller-path?utm_source=npm-caller-path&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
