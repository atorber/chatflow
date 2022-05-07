<a name="check-node-version"></a>
# check-node-version
[![NPM version](http://img.shields.io/npm/v/check-node-version.svg?style=flat-square)](https://www.npmjs.org/package/check-node-version)
[![AppVeyor build status](https://img.shields.io/appveyor/ci/parshap/check-node-version/master.svg?style=flat-square)](https://ci.appveyor.com/project/parshap/check-node-version/branch/master)
[![Travis build status](http://img.shields.io/travis/parshap/check-node-version/master.svg?style=flat-square)](https://travis-ci.org/parshap/check-node-version)

Check installed versions of `node`, `npm`, `npx`, `yarn`, and `pnpm`.

* [check-node-version](#check-node-version)
    * [Install](#check-node-version-install)
    * [Command Line Usage](#check-node-version-command-line-usage)
        * [Examples](#check-node-version-command-line-usage-examples)
    * [API Usage](#check-node-version-api-usage)


<a name="check-node-version-install"></a>
## Install

[npm: *check-node-version*](https://www.npmjs.com/package/check-node-version)

```bash
npm install check-node-version
```

<a name="check-node-version-command-line-usage"></a>
## Command Line Usage

```
SYNOPSIS
      check-node-version [OPTIONS]

DESCRIPTION
      check-node-version will check if the current node, npm, npx, yarn and pnpm
      versions match the given semver version ranges.

      If the given version is not satisfied, information about
      installing the needed version is printed and the program exits
      with an error code.

OPTIONS

      --node VERSION
            Check that the current node version matches the given semver
            version range.

      --npm VERSION
            Check that the current npm version matches the given semver
            version range.

      --npx VERSION
            Check that the current npx version matches the given semver
            version range.

      --yarn VERSION
            Check that the current yarn version matches the given semver
            version range.
 
      --pnpm VERSION
            Check that the current pnpm version matches the given semver
            version range.

      --package
            Use the "engines" key in the current package.json for the
            semver version ranges.
      
      --volta
            Use the versions pinned by Volta in the package.json

      -p, --print
            Print installed versions.

      -h, --help
            Print this message.

```

<a name="check-node-version-command-line-usage-examples"></a>
### Examples

<a name="check-node-version-command-line-usage-examples-check-for-node-6-failing"></a>
#### Check for node 6, failing

Check for node 6, but have 8.2.1 installed.

```bash
$ check-node-version --node 6
node: 8.2.1
Error: Wanted node version 6 (>=6.0.0 <7.0.0)
To install node, run `nvm install 6` or see https://nodejs.org/
$ echo $?
1
```

<a name="check-node-version-command-line-usage-examples-check-for-node-6-passing"></a>
#### Check for node 6, passing

If all versions match, there is no output:

```bash
$ check-node-version --node 6
$ echo $?
0
```

<a name="check-node-version-command-line-usage-examples-check-for-multiple-versions-simultaneously"></a>
#### Check for multiple versions simultaneously

You can check versions of any combinations of `node`, `npm`, `npx`, `yarn`, and `pnpm`
at one time.

```bash
$ check-node-version --node 4 --npm 2.14 --npx 6 --yarn 0.17.1 --pnpm 6.20.1
```

<a name="check-node-version-command-line-usage-examples-check-for-volta-pinned-versions"></a>
#### Check for volta pinned versions

You can check versions pinned by [Volta](https://volta.sh/):

```bash
$ check-node-version --volta
```

<a name="check-node-version-command-line-usage-examples-print-installed-versions"></a>
#### Print installed versions

Use the `--print` option to print currently installed versions.
If given a tool to check, only that will be printed.
Otherwise, all known tools will be printed.
Notes a missing tool.

```bash
$ check-node-version --print --node 11.12
node: 11.12.0
$ echo $?
0
```

```powershell
$ check-node-version --print
yarn: not found
node: 11.12.0
npm: 6.9.0
npx: 10.2.0
$ $LASTEXITCODE
0
```

> **NOTE:**
> Both preceding examples show that this works equally cross-platform,
> the first one being a *nix shell, the second one running on Windows.

> **NOTE:**
> As per [Issue 36](https://github.com/parshap/check-node-version/issues/36),
> non-semver-compliant versions (looking at yarn here) will be handled similarly to missing tools,
> just with a different error message.
>
> At the time of writing, we think that
> 1. all tools should always use semver
> 2. exceptions are bound too be very rare
> 3. preventing a crash is sufficient
>
> Consequently, we do not intend to support non-compliant versions to any further extent.


<a name="check-node-version-command-line-usage-examples-use-with-a-nvmrc-file"></a>
#### Use with a <code>.nvmrc</code> file

```bash
$ check-node-version --node $(cat .nvmrc) --npm 2.14
```

<a name="check-node-version-command-line-usage-examples-use-with-npm-test"></a>
#### Use with <code>npm test</code>

```json
{
  "name": "my-package",
  "devDependencies": {
    "check-node-version": "^1.0.0"
  },
  "scripts": {
    "test": "check-node-version --node '>= 4.2.3' && node my-tests.js"
  }
}
```

<a name="check-node-version-api-usage"></a>
## API Usage

This module can also be used programmatically.
Pass it an object with the required versions of `node`, `npm`, `npx`, `yarn` and/or `pnpm` followed by a results handler.

```javascript
const check = require("check-node-version");

check(
    { node: ">= 18.3", },
    (error, result) => {
        if (error) {
            console.error(error);
            return;
        }

        if (result.isSatisfied) {
            console.log("All is well.");
            return;
        }

        console.error("Some package version(s) failed!");

        for (const packageName of Object.keys(result.versions)) {
            if (!result.versions[packageName].isSatisfied) {
                console.error(`Missing ${packageName}.`);
            }
        }
    }
);
```

See `index.d.ts` for the full input and output type definitions.
