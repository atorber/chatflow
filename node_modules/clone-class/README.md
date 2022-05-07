# CLONE CLASS

[![NPM Version](https://badge.fury.io/js/clone-class.svg)](https://badge.fury.io/js/clone-class)
[![Build Status](https://api.travis-ci.com/huan/clone-class.svg?branch=master)](https://travis-ci.com/huan/clone-class)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

![Clone Class](https://huan.github.io/clone-class/images/clone-class-logo.png)

Clone an ES6 Class as Another Class Name for Isolating Class Static Properties. 

## EXAMPLE

Run the following example by:

```shell
git clone git@github.com:zixia/clone-class.git
cd clone-class
npm install
npm run example
```

### TypeScript

**[Example Source Code](https://github.com/huan/clone-class/blob/master/examples/example.ts):**

```ts
import * as assert from 'assert'

import {
  cloneClass,
  instanceToClass,
}                   from '../src/clone-class'

class Employee {
  public static company: string

  constructor(
    public name: string,
  ) {
  }

  public info() {
    console.log(`Employee ${this.name}, Company ${(this.constructor as any).company}`)
  }
}

/**
 * Example 1: `cloneClass()`
 */
const GoogleEmployee = cloneClass(Employee)
GoogleEmployee.company = 'Google'

const MicrosoftEmployee = cloneClass(Employee)
MicrosoftEmployee.company = 'Microsoft'

const employeeGg = new GoogleEmployee('Tom')
const employeeMs = new MicrosoftEmployee('Jerry')

employeeGg.info()
// Output: Employee Tom, Company Google
employeeMs.info()
// Output: Employee Jerry, Company Microsoft

/**
 * Example 2: `instanceToClass()`
 */
const RestoreGoogleEmployee = instanceToClass(employeeGg, Employee)
assert(RestoreGoogleEmployee === GoogleEmployee, 'Should get back the Class which instanciated the instance)
assert(RestoreGoogleEmployee !== Employee, 'Should be different with the parent Class')

const anotherEmployee = new RestoreGoogleEmployee('Mary')
anotherEmployee.info()
// Output: Employee Mary, Company Google
```

The most tricky part of this code is `(this.constructor as any).company`.

It will be very clear after we break down it as the following steps:

1. `this.constructor` is the constructor function of the class, which shuold be the _class function_ itself.
1. `company` is a static properity defined in `Employee` class, which will be set as a property on the _class function_.
1. So `this.constructor.company` is equal to `Employee.company`, except that we will not need to know the exact name of the class, `Employee` in this case. We use this pattern is because we need to visit the _class function_ even we do not know it's name.

## API

We have two APIs for dealing with the classes:

1. `cloneClass(OriginalClass)`: create a new Class that is `extend` from the `OriginalClass` which can isolate static properties for stored values, and return the new Class. 
1. `instanceToClass(instance, BaseClass)`: get the Class which had instanciated the `instance`, which is the `BaseClass`, or the child class of `BaseClass`, and return it.

### 1. `cloneClass()`

```ts
const GoogleEmployee = cloneClass(Employee)
const instance = new GoogleEmployee()

assert(instance instanceof GoogleEmployee)
assert(instance instanceof Employee)
assert(GoogleEmployee.name === Employee.name, 'Should be the same class name')
```

### 2. `instanceToClass()`

```ts
const instance = new GoogleEmployee()
const RestoredClass = instanceToClass(instance, Employee)
assert(RestoredClass === GoogleEmployee, 'because `instance` was created by `new GoogleEmployee()`')
```

### 3. `Constructor<T>`

```ts
class PrivateConstructorClass {
  private constructor() {
    console.info('private constructor called')
  }
}

const NewableClass = PrivateConstructorClass as any as Constructor<PrivateConstructorClass>
const instance = new NewableClass()
// Output: private constructor called
```

It seems useless at first, but if you want to use manage many Child Class for a Abstract Class with typings, then it will be a must have tool.

### 4. `looseInstanceOfClass(Klass)(target)`

use it to check whether a class instance is:

1. `instanceof` the class `Klass`
1. `instanceof` the class `Klass`'s child class
1. the `constructor.name` is the same as the class `Klass`

Usage:

```ts
looseInstanceOfClass = <C extends Constructor> (Klass: C) => (target: any): target is InstanceType<C>
```

### 5. `interfaceOfClass(Klass)<Interface>()(target)`

use it to check where a target object has all the same properties from class `Klass`

Usage:

```ts
interfaceOfClass = <C extends Constructor> (Klass: C) => <I extends {}> () => (target: any): target is I
```

## CHANGELOG

### master v1.0 (Oct 20, 2021)

1. Add `interfaceOfClass()` method to check whether a object satisfy a class interface.

#### v0.9 (Aug 26, 2021)

1. ESM Support
2. GitHub Action enabled
3. add `looseInstanceOfClass()` method to check whether two class has the same name (See ([wechaty/wechaty#2090](https://github.com/wechaty/wechaty/issues/2090)))

### v0.6 (May 2018)

1. add new function: `instanceToClass()` for getting back the `Class` from an existing `instance`.
1. add new type: `Constructor<T>` for adding `new (): T` to abstract class declaration.

### v0.4 (Apr 2018)

First publish version.

1. `cloneClass()` work as expected.

### v0.0.1 (Apr 23, 2018)

Initial version, code comes from Project Wechaty.

Learn more about the full story at Chatie blog: [New Feature: Multi-Instance Support for Wechaty v0.16(WIP)](https://blog.chatie.io/blessed-twins-bot/)

## SEE ALSO

An UseCase of `clone-class` can be found in an article writen by me from Chatie blog, it's also the place where this module comes from. It's Worth to spent some time to have a look if you are interested.

* [New Feature: Multi-Instance Support for Wechaty v0.16(WIP)](https://blog.chatie.io/blessed-twins-bot/)
* [TypeScript 2.1 keyof and Lookup Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html)
* [TypeScript Evolution](https://blog.mariusschulz.com/series/typescript-evolution)
* [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

## AUTHOR

[Huan LI](http://linkedin.com/in/zixia) \<zixia@zixia.net\>

<a href="https://stackexchange.com/users/265499">
  <img src="https://stackexchange.com/users/flair/265499.png" width="208" height="58" alt="profile for zixia on Stack Exchange, a network of free, community-driven Q&amp;A sites" title="profile for zixia on Stack Exchange, a network of free, community-driven Q&amp;A sites">
</a>

## COPYRIGHT & LICENSE

* Code & Docs © 2018 Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
