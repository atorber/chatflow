#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'
import type { SidecarMetadataFunctionDescription } from '../decorators/mod'

// import { getSidecarMetadataFixture } from '../../tests/fixtures/sidecar-metadata.fixture.js'

import {
  declareNativeArgs,
}                       from './declare-native-args.js'

test('declareNativeArgs()', async t => {

  // const fixture = getSidecarMetadataFixture()

  // // console.log(fixture.nativeFunctionList.length)
  // const result = fixture.nativeFunctionList
  //   .map(x => Object.values(x))
  //   .flat()
  //   .map(x => declareNativeArgs.call(x))

  // // get the fixture
  // // console.log(JSON.stringify(result, null, 2))

  const FIXTURE: [SidecarMetadataFunctionDescription, string][] = [
    [
      {
        name: 'anotherCall',
        paramTypeList: [
          [
            'pointer',
            'Int',
          ],
          [
            'pointer',
            'Pointer',
            'Utf8String',
          ],
        ],
        retType: [
          'pointer',
          'Int',
        ],
        target: {
          address: '0x4d',
          moduleName: null,
          type: 'address',
        },
      },
      [
        '// pointer type for arg[0] -> Int',
        'const anotherCall_NativeArg_0 = Memory.alloc(1024 /*Process.pointerSize*/)',
        'anotherCall_NativeArg_0.writeInt(args[0])',
        '',
        '// pointer type for arg[1] -> Pointer -> Utf8String',
        'const anotherCall_NativeArg_1 = Memory.alloc(1024 /*Process.pointerSize*/)',
        'const anotherCall_Memory_1_0 = Memory.alloc(Process.pointerSize)',
        'anotherCall_NativeArg_1.writePointer(anotherCall_Memory_1_0)',
        'anotherCall_Memory_1_0.writeUtf8String(args[1])',
      ].join('\n'),
    ],
    [
      {
        name: 'testMethod',
        paramTypeList: [
          [
            'pointer',
            'Utf8String',
          ],
          [
            'int',
          ],
        ],
        retType: [
          'pointer',
          'Utf8String',
        ],
        target: {
          address: '0x42',
          moduleName: null,
          type: 'address',
        },
      },
      [
        '// pointer type for arg[0] -> Utf8String',
        'const testMethod_NativeArg_0 = Memory.alloc(1024 /*Process.pointerSize*/)',
        'testMethod_NativeArg_0.writeUtf8String(args[0])',
        '',
        '// non-pointer type for arg[1]: int',
        'const testMethod_NativeArg_1 = args[1]',
      ].join('\n'),
    ],
    [
      {
        name: 'pointerMethod',
        paramTypeList: [
          [
            'pointer',
          ],
        ],
        retType: [
          'pointer',
        ],
        target: {
          exportName: 'MessageBoxW',
          moduleName: 'user32.dll',
          type: 'export',
        },
      },
      [
        '// pointer type for arg[0] -> ',
        'const pointerMethod_NativeArg_0 = ptr(Number(args[0]))',
      ].join('\n'),
    ],
    [
      {
        name: 'voidMethod',
        paramTypeList: [],
        retType: [
          'void',
        ],
        target: {
          address: '0x1234',
          moduleName: 'test',
          type: 'address',
        },
      },
      '',
    ],
    [
      {
        name: 'agentMethod',
        paramTypeList: [],
        target: {
          funcName: 'agentFunctionName',
          type: 'agent',
        },
      },
      '',
    ],
  ]

  for (const [fixture, expected] of FIXTURE) {
    const result = declareNativeArgs.call(fixture)
    t.equal(result, expected, `"${fixture.name}" should declare the native args correctly`)
  }
})
