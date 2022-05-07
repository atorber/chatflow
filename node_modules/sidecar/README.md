# Sidecar

[![NPM](https://github.com/huan/sidecar/actions/workflows/npm.yml/badge.svg)](https://github.com/huan/sidecar/actions/workflows/npm.yml)
[![NPM Version](https://img.shields.io/npm/v/sidecar?color=brightgreen)](https://www.npmjs.com/package/sidecar)
[![npm (tag)](https://img.shields.io/npm/v/sidecar/next.svg)](https://www.npmjs.com/package/wechaty-puppet-whatsapp?activeTab=versions)
[![Powered by Frida](https://img.shields.io/badge/Powered%20By-Frida-red.svg)](https://github.com/https://github.com/frida/frida)

Sidecar is a runtime hooking tool for intercepting function calls by TypeScript annotation with ease, powered by [Frida.RE](https://frida.re/).

![Frida Sidecar](docs/images/sidecar.webp)

> Image source: [1920s Raleigh Box Sidecar Outfit](https://oldbike.wordpress.com/1920s-raleigh-box-sidecar-outfit/) & [ShellterProject](https://www.shellterproject.com/)

## What is a "Sidecar" Pattern?

> Segregating the functionalities of an application into a separate process can be viewed as a Sidecar pattern. The Sidecar design pattern allows you to add a number of capabilities to your application without the need of additional configuration code for 3rd party components.
>
> As a sidecar is attached to a motorcycle, similarly in software architecture a sidecar is attached to a parent application and extends/enhances its functionalities. A Sidecar is loosely coupled with the main application.
>
> &mdash; SOURCE: [Sidecar Design Pattern in your Microservices Ecosystem, Samir Behara, July 23, 2018](https://samirbehara.com/2018/07/23/sidecar-design-pattern-in-your-microservices-ecosystem/)

## What is a "Hooking" Patern?

> Hook: by intercepting function calls or messages or events passed between software components.
> &mdash; SOURCE: [Hooking, Wikipedia](https://en.wikipedia.org/wiki/Hooking)

## Features

1. Easy to use by TypeScript decorators/annotations
    1. `@Call(memoryAddress)` for make a API for calling memory address from the binary
    1. `@Hook(memoryAddress)` for emit arguments when a memory address is being called
1. Portable on Windows, macOS, GNU/Linux, iOS, Android, and QNX, as well as X86, Arm, Thumb, Arm64, AArch64, and Mips.
1. Powered by Frida.RE and can be easily extended by any agent script.

## Requirements

1. Mac: disable [System Integrity Protection](https://support.apple.com/en-us/HT204899)

## Introduction

When you are running an application on the
Linux, Mac, Windows, iPhone, or Android,
you might want to make it programmatic,
so that your can control it automatically.

The SDK and API are designed for achieving this, if there are any.
However, most of the application have very limited functionalities
for providing a SDK or API to the developers,
or they have neither SDK nor API at all,
what we have is only the binary executable application.

How can we make a binary executable application to be able to called
from our program? If we can call the function in the application process
directly, then we will be able to make the application as our SDK/API,
then we can make API call to control the application,
or hook function inside the application to get to know what happened.

I have the above question and I want to find an universal way to solve it: Frida is for rescue. [Frida](https://frida.re/) is a dynamic instrumentation toolkit for developers and reverse-engineers, which can help us easily call the internal function from a process,
or hook any internal function inside the process. And it has a nice Node.js binding and TypeScript support, which is nice to me because I love TypeScript much.

That's why I start build this project: **Sidecar**.
Sidecar is a runtime hooking tool
for intercepting function calls
by decorate a TypeScript class with annotation.

Here's an example code example for demostration that how easy
it can help you to hook a exiting application.

### Talk is cheap, show me the code

```ts
@Sidecar('chatbox')
class ChatboxSidecar extends SidecarBody {

  @Call(0x11c9)
  @RetType('void')
  mo (
    @ParamType('pointer', 'Utf8String') content: string,
  ): Promise<string> { return Ret(content) }

  @Hook(0x11f4)
  mt (
    @ParamType('pointer', 'Utf8String') content: string,
  ) { return Ret(content) }

}

async function main () {
  const sidecar = new ChatboxSidecar()
  await attach(sidecar)

  sidecar.on('hook', ({ method, args }) => {
    console.log('method:', method)
    console.log('args:', args)
    sidecar.mo('Hello from Sidecar'),
  })

  process.on('SIGINT',  () => detach(sidecar))
  process.on('SIGTERM', () => detach(sidecar))
}

main().catch(console.error)
```

Learn more from the sidecar example: <https://github.com/huan/sidecar/blob/main/examples>

## To-do list

- [x] `Intercepter.attach()` a `NativeCallback()` ~~ptr not work in Sidecar generated script. (it is possible by direct using the frida cli)~~ worked! ([#9](https://github.com/huan/sidecar/issues/9))
- [x] Add typing.d.ts for Sidecar Agent pre-defined variables & functions
- [ ] Add `@Name()` support for specify parameter names in `@Hook()`-ed method args.
- [ ] Calculate `Memory.alloc()` in sidecar agent scripts automatically.

## Explanation

### 1. Sidecar Steps

When we are running a Sidecar Class, the following steps will happend:

1. From the sidecar class file, decorators save all configs to the class metadata.
    1. `@Sidecar()`: <src/decorators/sidecar/sidecar.ts>, <src/decorators/sidecar/build-sidecar-metadata.ts>
    1. `@Call()`: <src/decorators/call/call.ts>
    1. `@ParamType()`: <src/decorators/param-type/param-type.ts>
    1. `@RetType()`: <src/decorators/ret-type/ret-type.ts>
    1. `@Hook()`, `@Name`, etc.
1. `SidecarBody`(<src/sidecar-body/sidecar-body.ts>) base class will generate `agentSource`:
    1. `getMetadataSidecar()`(<src/decorators/sidecar/metadata-sidecar.ts>) for get the sidecar metadata from the class
    1. `buildAgentSource()`(<src/agent/build-agent-source.ts>) for generate the agent source code for the whole sidecar system.
1. Call the `attach()` method to attach the sidecar to the target
1. Call the `detach()` method to detach the sidecar to the target

## References

### 1. `@Sidecar(sidecarTarget, initAgentScript)`

1. `sidecarTarget`    : `SidecarTarget`,
1. `initAgentScript`? : `string`,

The class decorator.

`sidecarTarget` is the executable binary name,
and the `initAgentScript` is a Frida agent script
that help you to do whatever you want to do
with Frida system.

Example:

```ts
import { Sidecar } from 'sidecar'
@Sidecar('chatbox')
class ChatboxSidecar {}
```

It is possible to load a init agent script, for example:

```ts
const initAgentScript = 'console.log("this will be runned when the sidecar class initiating")'
@Sidecar(
  'chatbox', 
  initAgentScript,
)
```

`sidecarTarget` supports `Spawn` mode, by specifing the `sidecarTarget` as a `array`:

```ts
@Sidecar([
  '/bin/sleep', // command
  [10],         // args
])
```

To learn more about the power of `initAgentScript`, see also this great repo with lots of examples: [Hand-crafted Frida examples](https://github.com/iddoeldor/frida-snippets)

### 2. `class SidecarBody`

Base class for the `Sidecar` class. All `Sidecar` class need to `extends` from the `SidecarBody`, or the system will throw an error.

Example:

```ts
import { SidecarBody } from 'sidecar'
class ChatboxSidecar extends SidecarBody {}
```

### 3. `@Call(functionTarget)`

1. `functionTarget`: `FunctionTarget`

The native call method decorator.

`functionTarget` is the address (in `number` type) of the function which we need to call in the executable binary.

Example:

```ts
import { Call } from 'sidecar'
class ChatboxSidecar {
  @Call(0x11c9) mo () {}
}
```

If the `functionTarget` is not the type of `number`, then it can be `string` or an `FunctionTarget` object. See `FunctionTarget` section to learn more about the advanced usage of `FunctionTarget`.

### 4. `@Hook(functionTarget)`

1. `functionTarget`: `FunctionTarget`

The hook method decorator.

`functionTarget` is the address (in `number` type) of the function which we need to hook in the executable binary.

Example:

```ts
import { Hook } from 'sidecar'
class ChatboxSidecar {
  @Hook(0x11f4) mt () {}
}
```

If the `functionTarget` is not the type of `number`, then it can be `string` or an `FunctionTarget` object. See `FunctionTarget` section to learn more about the advanced usage of `FunctionTarget`.

### 5. `@RetType(nativeType, ...pointerTypeList)`

1. `nativeType`      : `NativeType`
1. `pointerTypeList` : `PointerType[]`

```ts
import { RetType } from 'sidecar'
class ChatboxSidecar {
  @RetType('void') mo () {}
```

### 6. `@ParamType(nativeType, ...pointerTypeList)`

1. `nativeType`      : `NativeType`
1. `pointerTypeList` : `PointerType[]`

```ts
import { ParamType } from 'sidecar'
class ChatboxSidecar {
  mo (
    @ParamType('pointer', 'Utf8String') content: string,
  ) {}
```

### 7. `Name(parameterName)`

TODO: to be implemented.

1. `parameterName`: `string`

The parameter name.

This is especially useful for `Hook` methods.
The `hook` event will be emit with the method name and the arguments array.
If the `Name(parameterName)` has been set,
then the event will have additional information for the parameter names.

```ts
import { Name } from 'sidecar'
class ChatboxSidecar {
  mo (
    @Name('content') content: string,
  ) {}
```

### 8. `Ret(...args)`

1. `args`: `any[]`

Example:

```ts
import { Ret } from 'sidecar'
class ChatboxSidecar {
  mo () { return Ret() }
```

### 9. `FunctionTarget`

The `FunctionTarget` is where `@Call` or `@Hook` to be located. It can be created by the following factory helper functions:

1. `addressTarget(address: number, module?: string)`: memory address. i.e. `0x369adf`. Can specify a second `module` to call `address` in a specified module
1. `agentTarget(funcName: string)`: the JavaScript function name in `initAgentScript` to be used
1. `exportTarget(exportName: string, exportModule?: string)`: export name of a function. Can specify a second `moduleName` to load `exportName` from it.
1. `objcTarget`: to be added
1. `javaTarget`: to be added

For convenice, the `number` and `string` can be used as `FunctionTarget` as an alias of `addressTarget()` and `agentTarget()`. When we are defining the `@Call(target)` and `@Hook(target)`:

1. if the target type is `number`, then it will be converted to `addressTarget(target)`
1. if the target type is `string`, then it will be converted to `agentTarget(target)`

Example:

```ts
import { 
  Call,
  addressTarget,
} from 'sidecar'
class ChatboxSidecar {
  @Call(
    addressTarget(0x11c9)
  )
  mo () {}
}
```

#### 9.1 `agentTarget(funcName: string)`

`agentTarget` let you specify a `funcName` in the `initAgentScript` source code, and will use it directly for advanced users.

There's two type of the `AgentTarget` usage: `@Call` and `@Hook`.

1. `AgentTarget` with `@Call`: the `funcName` should be a JavaScript function instance in the `initAgentScript`. The decorated method call that function.
1. `AgentTarget` with `@Hook`: the `funcName` should be a `NativeCallback` instance in the `initAgentScript`. The decorated method hook that callback.

Notes:

1. The `NativeFunction` passed to `@Call` must pay attention to
  the **Garbage Collection** of the JavaScript inside Frida.
  You have to hold a reference to all the memory you alloced by yourself,
  for example, store them in a `Object` like `const refHolder = { buf }`,
  then make sure the `refHolder` will be hold
  unless you can `free` the memory that you have alloced before. (See also: [Frida Best Practices](https://frida.re/docs/best-practices/))
1. the `NativeCallback` passed to `@Hook` is recommended to be a empty function,
  like `() => {}` because it will be replaced by Sidecar/Frida.
  So you should not put any code inside it,

## Debug utility: `sidecar-dump`

Sidecar provide a utility named `sidecar-dump` for viewing the metadata of the sidecar class, or debuging the frida agent init source code.

You can run this util by the following command:

```sh
$ npx sidecar-dump --help
sidecar-dump <subcommand>
> Sidecar utility for dumping metadata/source for a sidecar class

where <subcommand> can be one of:

- metadata - Dump sidecar metadata
- source - Dump sidecar agent source

For more help, try running `sidecar-dump <subcommand> --help`
```

`sidecar-dump` support two sub commands:

1. `metadata`: dump the metadata for a sidecar class
1. `source`: dump the generated frida agent source code for a sidecar class

### 1. `sidecar-dump metadata`

Sidecar is using decorators heavily, for example, we are using `@Call()` for specifying the process target, `@ParamType()` for specifying the parameter data type, etc.

Internally, sidecar organize all the decorated information as metadata and save them into the class.

the `sidecar-dump metadata` command is to viewing this metadata information, so that we can review and debug them.

For example, the following is the metadata showed by sidecar-dump for our `ChatboxSidecar` class from [examples/chatbox-sidecar.ts](examples/chatbox-sidecar.ts).

```sh
$ sidecar-dump metadata examples/chatbox-sidecar.ts
{
  "initAgentScript": "console.log('inited...')",
  "interceptorList": [
    {
      "agent": {
        "name": "mt",
        "paramTypeList": [
          [
            "pointer",
            "Utf8String"
          ]
        ],
        "target": "agentMt_PatchCode",
        "type": "agent"
      }
    }
  ],
  "nativeFunctionList": [
    {
      "agent": {
        "name": "mo",
        "paramTypeList": [
          [
            "pointer",
            "Utf8String"
          ],
          [
            "pointer",
            "Utf8String"
          ]
        ],
        "retType": [
          "void"
        ],
        "target": "agentMo",
        "type": "agent"
      }
    }
  ],
  "sidecarTarget": "/tmp/t/examples/chatbox/chatbox-linux"
}
```

### 2. `sidecar-dump source`

Sidecar is using Frida to connect to the program process and make communication with it.

In order to make the connection, sidecar will generate a frida agent source code, and using this agent as the bridge between the sidecar, frida, and the target program process.

the `sidecar-dump source` command is to viewing this frida agent source, so that we can review and debug them.

For example, the following is the source code showed by sidecar-dump for our `ChatboxSidecar` class from [examples/chatbox-sidecar.ts](examples/chatbox-sidecar.ts).

```ts
$ sidecar-dump source  examples/chatbox-sidecar.ts
...
const __sidecar__mo_Function_wrapper = (() => {
  const nativeFunctionAddress =
    __sidecar__moduleBaseAddress
    .add(0x11e9)

  const nativeFunction = new NativeFunction(
    nativeFunctionAddress,
    'int',
    ['pointer'],
  )

  return function (...args) {
    log.verbose(
      'SidecarAgent',
      'mo(%s)',
      args.join(', '),
    )

    // pointer type for arg[0] -> Utf8String
    const mo_NativeArg_0 = Memory.alloc(1024 /*Process.pointerSize*/)
    mo_NativeArg_0.writeUtf8String(args[0])

    const ret = nativeFunction(...[mo_NativeArg_0])
    return Number(ret)
  }
})()

;(() => {
  const interceptorTarget =
    __sidecar__moduleBaseAddress
    .add(0x121f)

  Interceptor.attach(
    interceptorTarget,
    {
      onEnter: args => {
        log.verbose(
          'SidecarAgent',
          'Interceptor.attach(0x%s) onEnter()',
          Number(0x121f).toString(16),
        )

        send(__sidecar__payloadHook(
          'mt',
          [ args[0].readUtf8String() ]
        ), null)

      },
    }
  )
})()

rpc.exports = {
  mo: __sidecar__mo_Function_wrapper,
}
```

You can dump the sidecar agent source code to a javascript file, then using it with frida directly for debugging & testing.

```sh
$ sidecar-dump source chatbox-sidecar.ts > agent.js
$ frida chatbox -l agent.js
     ____
    / _  |   Frida 14.2.18 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
                                                                                
[Local::chatbox]-> rpc.exports.mo('hello from frida cli')
```

## Resources

### RPA Examples

1. [Quake REST API demo](https://gist.github.com/oleavr/51066491b6961b608fb38fb1fb971dd3)

### Papers

1. [Assembly to Open Source Code Matching for Reverse Engineering and Malware Analysis](https://pdfs.semanticscholar.org/00d8/9af14d1632499636917613a27edac5cf5005.pdf)

### Dll

1. [Wikipedia: DLL injection](https://en.wikipedia.org/wiki/DLL_injection)
1. [Code Tutorial: InjectDLL](http://www.quantumg.net/injectdll.php)

### Frida

1. TypeScript - [Frida环境搭建 - windows (给IDE提供智能感知/提示)](https://bbs.pediy.com/thread-254086.htm)
1. TypeScript - [Example - Frida agent written in TypeScript](https://github.com/oleavr/frida-agent-example)
1. Talk Video - [Prototyping And Reverse Engineering With Frida by Jay Harris](https://www.youtube.com/watch?v=cLUl_jK59EM)
1. Talk Video - [r2con 2017 - Intro to Frida and Dynamic Machine Code Transformations by Ole Andre](https://www.youtube.com/watch?v=sBcLPLtqGYU)
1. [Hand-crafted Frida examples](https://github.com/iddoeldor/frida-snippets)
1. Slide - [基于 FRIDA 的全平台逆向分析 - caisi.zz@alipay.com](https://www.slideshare.net/ssusercf6665/frida-107244825) ([GitHub repo](https://github.com/ChiChou/gossip-summer-school-2018/blob/master/ios-macOS-fake-location/fake.js))
1. [Awesome Frida](https://github.com/dweinstein/awesome-frida)
1. [How to call methods in Frida Gadget (JavaScript API iOS)](https://github.com/frida/frida/issues/567)
1. [Frida调用栈符号恢复](http://4ch12dy.site/2019/07/02/xia0CallStackSymbols/xia0CallStackSymbols/)
1. [Cross-platform reversing with Frida, Oleavr, NoConName December 2015](https://frida.re/slides/ncn-2015-cross-platform-reversing-with-frida.pdf)
1. [Frida: JavaScript API](https://frida.re/docs/javascript-api/)
1. [Calling native functions with Frida, @poxyran](https://poxyran.github.io/poxyblog/src/pages/02-11-2019-calling-native-functions-with-frida.html)
1. [Shellcoding an Arm64 In-Memory Reverse TCP Shell with Frida, Versprite](https://versprite.com/blog/application-security/frida-engage-part-two-shellcoding-an-arm64-in-memory-reverse-tcp-shell-with-frida/)
1. [Anatomy of a code tracer, Ole André Vadla Ravnås, Oct 24, 2014](https://medium.com/@oleavr/anatomy-of-a-code-tracer-b081aadb0df8)
1. [frida-boot 👢
a binary instrumentation workshop, using Frida, for beginners, @leonjza](http://lib.21h.io/library/5UT97EFH/download/FNGRSN2C/3c5bde85-2f1b-4eee-9a98-c2d959d732ee.pdf)
1. [frida javascript api手册](https://www.cnblogs.com/Eeyhan/p/13414629.html)
1. [Frida 12.7 Released - CModule](https://frida.re/news/2019/09/18/frida-12-7-released/)
1. [Getting Started with Frida: Hooking a Function and Replacing its Arguments](https://blog.fadyothman.com/getting-started-with-frida-hooking-main-and-playing-with-its-arguments/)

### Unicode

1. [字符编码笔记：ASCII，Unicode 和 UTF-8, 阮一峰，2007年10月28日](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

### Assembler

- [Online x86 / x64 Assembler and Disassembler](https://defuse.ca/online-x86-assembler.htm) (`0xf` is not valid, use `0x0f` instead)
- [易语言汇编代码转置入代码开源](https://www.eyuyan.la/post/15447.html)
- [The 32 bit x86 C Calling Convention](https://aaronbloomfield.github.io/pdr/book/x86-32bit-ccc-chapter.pdf)
- [x86 Disassembly/Calling Conventions](https://en.wikibooks.org/wiki/X86_Disassembly/Calling_Conventions)
- [How to pass parameters to a procedure in assembly?](https://stackoverflow.com/a/44738641/1123955)
- [NativeCallback doesn't seem to work on Windows, except for mscdecl #525](https://github.com/frida/frida-gum/issues/525)

### ObjC

- [Learn Object-C Cheatsheet](http://cocoadevcentral.com/d/learn_objectivec/)
- [Objective-C // Runtime Method Injection](http://labs.distriqt.com/post/846)
- [The Node.js ⇆ Objective-C bridge](https://github.com/tootallnate/NodObjC)
- [iOS逆向分析笔记](https://www.jianshu.com/p/157f56d60a59)
- [iOS — To swizzle or not to swizzle?](https://medium.com/rocknnull/ios-to-swizzle-or-not-to-swizzle-f8b0ed4a1ce6)
- [0x04 Calling iOS Native Functions from Python Using Frida and RPC](https://grepharder.github.io/blog/0x04_calling_ios_native_functions_from_python_using_frida_and_rpc.html)
- [Runtime奇技淫巧之类(Class)和对象(id)以及方法(SEL)](https://www.jianshu.com/p/37e1b71ad03a)

### Java

- [Tiktok data acquisition Frida tutorial, Java, Interceptor, NativePointer(Function/Callback) usage and examples](https://www.fatalerrors.org/a/0dx91Tk.html)

## Related project: FFI Adapter

I have another NPM module named [ffi-adapter](https://github.com/huan/ffi-adapter), which is a Foreign Function Interface Adapter Powered by Decorator & TypeScript.

Learn more about FFI from its examples at <https://github.com/huan/ffi-adapter/tree/master/tests/fixtures/library>

## Badge

[![Powered by Sidecar](https://img.shields.io/badge/Powered%20By-Sidecar-brightgreen.svg)](https://github.com/huan/sidecar)

```markdown
[![Powered by Sidecar](https://img.shields.io/badge/Powered%20By-Sidecar-brightgreen.svg)](https://github.com/huan/sidecar)
```

## Demos for Community

We have created different demos that work-out-of-box for some use cases.

You can visit them at [Sidecar Demos](https://github.com/wechaty/sidecar-demos) if you are interested.

## History

### Master v0.17

1. ES Modules support ([#17](https://github.com/huan/sidecar/issues/17))
1. TypeScript version 4.4
1. Breaking change: Add `hook` event for all hooked methods

### v0.14

Publish to NPM as **sidecar** package name!

1. Enforce `AgentTarget` not to be decorated by neither `@ParamType` nor `@RetType` for prevent confusing.

### v0.12 (Aug 5, 2021)

1. Refactor wrappers for include '[' and ']' in array return string
1. `agentTarget` now point to JavaScript function in `initAgentScript` instead of ~~`NativeFunction`~~
1. Add `scripts/post-install.ts` to double check `frida_binding.node` existance and run `prebuild-install` with cdn if needed ([#14](https://github.com/huan/sidecar/issues/14))

### v0.9 (Jul 29, 2021)

1. `agentTarget` will use `NativeFunction` instead of a plain javascript function
1. Clean sidecar frida agent templates
    1. Use closure to encapsulate variables
    1. Add `__sidecar__` namespace for all variable names
1. Enhance `@Sidecar()` to support spawn target. e.g. `@Sidecar(['/bin/sleep', [10]])`
1. Add `.so` & `.DLL` library example for Linux & Windows ([Dynamic Library Example](examples/dynamic-library/))
1. Add support for raw `pointer` type

### v0.6 (Jul 7, 2021)

1. Upgrade to TypeScript 4.4-dev for supporting index signatures for symbols. ([Microsoft/TypeScript#44512](https://github.com/microsoft/TypeScript/pull/44512))
1. Add `sidecar-dump` utility: it dump the sidecar `metadata` and `source` from a class defination file now.
1. Add pack testing for `sidecar-dump` to make sure it works under Liniux, Mac, and Windows.

### v0.2 (Jul 5, 2021)

1. Add `agent` type support to `FunctionTarget` so that both `@Call` and `@Hook`can use a pre-defined native function ptr defined from the `initAgentScript`. (more types like `java`, `objc`, `name`, and `module` to be added)

### v0.1 (Jul 4, 2021)

First worked version, published to NPM as `sidecar`.

### v0.0.1 (Jun 13, 2021)

Repo created.

## Troubleshooting

### 1. Debug `initAgentScript`

If sidecar tells you that there's some script error internally, you should use `sidecar-dump` utility to dump the source of the frida agent script to a `agent.js` file, and use `frida -l agent.js` to debug it to get a clearly insight.

```sh
$ sidecar-dump source your-sidecar-class.ts > agent.js
$ frida -l agent.js
# by this way, you can locate the error inside the agent.js
# for easy debug and fix.
```

## Special thanks

Thanks to Quinton Ashley [@quinton-ashley](https://github.com/quinton-ashley) who is the previous owner of NPM name `sidecar` and he transfer this beautify name to me for publishing this project after I requested via email. Appreciate it! (Jun 29, 2021)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), [Microsoft Regional Director](https://rd.microsoft.com/en-us/huan-li), zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Docs released under Creative Commons
- Code released under the Apache-2.0 License
- Code & Docs © 2021 Huan LI \<zixia@zixia.net\>
