import {CallSite as CallSiteInterface} from 'callsites';

declare namespace callerCallsite {
	type CallSite = CallSiteInterface;

	interface Options {
		/**
		The callsite depth, meaning how many levels we follow back on the stack trace.

		@default 0

		@example
		```
		// foo.ts
		import callerCallsite = require('caller-callsite');

		module.exports = () => {
			console.log(callerCallsite().getFileName());
			//=> '/Users/sindresorhus/dev/unicorn/foobar.ts'
			console.log(callerCallsite({depth: 1}).getFileName());
			//=> '/Users/sindresorhus/dev/unicorn/bar.ts'
			console.log(callerCallsite({depth: 2}).getFileName());
			//=> '/Users/sindresorhus/dev/unicorn/foo.ts'
		}

		// bar.ts
		import foo = require('./foo');

		module.exports = () => {
			foo();
		}

		// foobar.ts
		import bar = require('./bar');
		bar();
		```
		*/
		readonly depth?: number;
	}
}

/**
Get the [callsite](https://github.com/sindresorhus/callsites#api) of the caller function.

@example
```js
// foo.ts
import callerCallsite = require('caller-callsite');

export default () => {
	console.log(callerCallsite().getFileName());
	//=> '/Users/sindresorhus/dev/unicorn/bar.ts'
}

// bar.ts
import foo from './foo';
foo();
```
*/
declare function callerCallsite(options?: callerCallsite.Options): callerCallsite.CallSite | undefined;

export = callerCallsite;
