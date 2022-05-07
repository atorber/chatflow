# git-scripts

![NPM](https://github.com/zixia/git-scripts/workflows/NPM/badge.svg)
[![NPM Version](https://badge.fury.io/js/git-scripts.svg)](https://www.npmjs.com/package/git-scripts)

Manage [git hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) with the "git.scripts" field of the package.json like [npm-scripts](https://npmjs.org/doc/scripts.html).

```json
{
  "name": "your-project",
  "version": "0.0.0",
  "description": "",
  "devDependencies": {
    "git-scripts": "*"
  },
  "git": {
    "scripts": {
      "pre-commit": "npm test",
      "post-merge": "npm install"
    }
  }
}
```

See also [this module's package.json](https://github.com/nkzawa/git-scripts/blob/master/package.json) as an example.

## Installation
    $ npm install git-scripts

NOTE: `.git/hooks` of your project is replaced when installed. You can restore it by uninstalling the module.

## Description
git-scripts supports all hooks including the following:

* applypatch-msg
* pre-applypatch
* post-applypatch
* pre-commit
* prepare-commit-msg
* commit-msg
* post-commit
* pre-rebase
* post-checkout
* post-merge
* pre-receive
* update
* post-receive
* post-update
* pre-auto-gc
* post-rewrite
* pre-push

## CLI
    $ npm install -g git-scripts

```
Usage: git-scripts <command> [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Commands:

    install [path]           install git-scripts
    uninstall [path]         uninstall git-scripts
    run <name> [args ...]    run arbitrary scripts
```

NOTE: Usually, you don't need CLI. Hooks are enabled automatically when you install the module locally.

## Using Programmatically
If you would like to use git-scripts programmatically, you can do that.

```js
var scripts = require('git-scripts');
var project = scripts('somewhere/yourproject');

project.install(function(err) {
  if (err) throw err;
  console.log('git-scripts was installed.');

  project.run('pre-commit', function(err) {
    if (err) throw err;
    console.log('pre-commit script succeeded.');
  });
});
```

### Documentation
```js
var scripts = require('git-scripts');
var project = scripts('somewhere/yourproject');
```

#### scripts([path])
Create a git-scripts instance for `path`.

#### project.install([callback])
Install git-scripts.

#### project.uninstall([callback])
Uninstall git-scripts.

#### project.run(name, [args ...], [callback])
Run an arbitrary command of `name`.

## Author

Naoyuki Kanezawa <naoyuki.kanezawa@gmail.com>

## Maintainer

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) <zixia@zixia.net>

## License

MIT
