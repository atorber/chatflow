# TSTEST

[![NPM Version](https://badge.fury.io/js/tstest.svg)](https://www.npmjs.com/package/tstest)
[![npm (tag)](https://img.shields.io/npm/v/tstest/next.svg)](https://www.npmjs.com/package/tstest?activeTab=versions)
[![NPM](https://github.com/huan/tstest/actions/workflows/npm.yml/badge.svg)](https://github.com/huan/tstest/actions/workflows/npm.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

Helps you write better TypeScript programs

[![tstest](https://huan.github.io/tstest/images/tstest-logo.png)](https://github.com/huan/tstest)

tstest is a mature full-featured TypeScript testing tool that helps you write better programs.

The tstest framework makes it easy to write small tests, yet scales to support complex functional testing for applications and libraries.

## Features

NOTICE: All the features listed below, is NOT YET IMPLENMENTED.

TO DO:

1. Detailed info on failing assert statements (no need to remember self.assert* names);
1. Auto-discovery of test modules and functions;
1. Modular fixtures for managing small or parametrized long-lived test resources;
1. Can run unittest (including trial) and nose test suites out of the box;
1. JavaScript, TypeScript, Google Apps Script (untested);
1. Rich plugin architecture, with over n+ external plugins and thriving community;
1. Out-of-the-Box Dual Browser/Node.js environment testing support;

This module is highly inspired by [pytest](https://pytest.org/)

## API

1. `test` for containerization testings
1. `sinon` for mocking everything you need
1. `AssertEqual` for check TypeScript typings
1. `testSchedulerRunner` for RxJS marble testing

## SEE ALSO

* [Testing Python Applications with Pytest](https://semaphoreci.com/community/tutorials/testing-python-applications-with-pytest)
* [Typescript Dependency Injection and Decorators](http://source.coveo.com/2016/02/04/typescript-injection-decorator/)
* [Decorators with TypeScript](https://codingblast.com/decorators-intro/)

### Decorators

* [TypeScript > Decorators #2249](https://github.com/Microsoft/TypeScript/issues/2249)
* [error TS1206: Decorators are not valid here? #3661](https://github.com/Microsoft/TypeScript/issues/3661)
* [TypeScript-Handbook > Decorators](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md)
* [Prototype for a Metadata Reflection API for ECMAScript](https://github.com/rbuckton/reflect-metadata)
* [Function Expression Decorators (ECMA-262 Proposal)](https://docs.google.com/document/d/1ikxIP5-RVYq6d_f8lAvf3pKC00W78ueyp-xIZ6q67uU/edit#)
* [Javascript Decorators](https://github.com/wycats/javascript-decorators)

### AST

#### Online Tools

* [AST Online Explorer](https://astexplorer.net/)
* [TypeScript AST Viewer Online](https://ts-ast-viewer.com/)

#### Articles & Projects

* [TypeScript > Using the Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
* [TypeScript Compiler Internals · TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/compiler/overview.html)
* [TypeScript Compiler API wrapper for static analysis and code manipulation](https://github.com/dsherret/ts-simple-ast)

### Other Tools

* [Testing: tape vs. tap](https://remysharp.com/2016/02/08/testing-tape-vs-tap)

## CHANGELOG

### main v1.2 (Mar 6, 2022)

1. add `testScheduleRunner` helper function to `tstest` module for testing RxJS marble diagrams.
1. upgrade [tap](https://www.npmjs.com/package/tap) to v16. (fix [tapjs/node-tap#791](https://github.com/tapjs/node-tap/issues/791)).

### v1.0 (Oct 24, 2021)

Release v1.0 of tstest

1. Upgrade to [tap](https://github.com/tapjs/node-tap) to replace [blue-tape](https://github.com/spion/blue-tape) ([wechayt/wechaty#2223](https://github.com/wechaty/wechaty/pull/2223))
1. Remove `sinon-test`
1. Enable ES Modules
1. Add `AssertEqual` for typing tests

### v0.4 June 07, 2019

1. Publish as a testing toolset wrapper for convenience:
    1. `blue-tap`
    1. `sinon`
    1. `@types/blue-tap`
    1. `@types/sinon`

### v0.1 March 21, 2018

1. Received the NPM package name: **tstest** from David Auffret.
1. Scratched a tstest logo.
1. Linked to pytest.

## THANKS

Thanks to David Auffret who owned the `tstest` name of NPM module. He is so kind and nice that passed this name over to me with the help of support from NPM after my request.

```shell
$ npm deprecate tstest@0.0 'tstest had been republished as a test framework from v0.1'
...

```

## AUTHOR

[Huan LI (李卓桓)](http://linkedin.com/in/zixia), [Microsoft Regional Director](https://rd.microsoft.com/en-us/huan-li), <zixia@zixia.net>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## COPYRIGHT & LICENSE

- Code & Docs © 2019 Huan LI zixia@zixia.net
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
