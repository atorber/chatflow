# @chatie/git-scripts

[![NPM Version](https://badge.fury.io/js/%40chatie%2Fgit-scripts.svg)](https://www.npmjs.com/package/@chatie/git-scripts)
[![npm (tag)](https://img.shields.io/npm/v/%40chatie/git-scripts/next.svg)](https://www.npmjs.com/package/@chatie/git-scripts?activeTab=versions)
[![Build Status](https://travis-ci.com/Chatie/git-scripts.svg?branch=master)](https://travis-ci.com/Chatie/git-scripts)

![Git Hooks](https://chatie.github.io/git-scripts/images/git-hook.gif)
> Source: [Git Hooks - Git](https://www.seekpng.com/ipng/u2w7o0i1u2w7o0e6_git-hooks-git/)

Git Hooks Integration for Chatie Projects

## USAGE

This module is a wrapper of the NPM module [git-scripts](https://www.npmjs.com/package/git-scripts), it provide following additional features:

1. `pre-push` hook had been set to run `npm run lint` and then `npm verion patch` before `git push` for better code quality and version management.

Learn more about the original `git-scripts` from its GitHub homepage: [git-scripts](https://github.com/nkzawa/git-scripts)

## DISABLE THE HOOK

You can skip git hook for `pre-push` if you want.

### 1. Temporary

To temporary disable the `pre-push` git hook, you can set `NO_HOOK=1` before do `git push`:

```shell
# for Linux & Mac
NO_HOOK=1 git push

# for Windows

set NO_HOOK=1 git push
```

### 2. Permanent

To permanent disable the `pre-push` git hook, you can delete the related settings in `package.json`:

```diff
-  "git": {
-    "scripts": {
-      "pre-push": "npx git-scripts-pre-push"
-    }
-  }
```

## CHANGELOG

### master

### v0.2 (10 Jun 2019)

1. Install hook to `package.json` automatically

### v0.0.1 (08 Jun 2019)

1. Wrap `git-scripts`

## AUTHOR

[Huan LI (李卓桓)](http://linkedin.com/in/zixia) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

- Code & Docs © 2019 - now Huan LI zixia@zixia.net
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
