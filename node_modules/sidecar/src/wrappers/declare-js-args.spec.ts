#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

// import { getSidecarMetadataFixture } from '../../tests/fixtures/sidecar-metadata.fixture.js'
import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'
import { declareJsArgs } from './declare-js-args.js'

test('declareJsArgs()', async t => {
  // const SIDECAR_METADATA = getSidecarMetadataFixture()

  // const nativeFunctionList      = SIDECAR_METADATA.nativeFunctionList
  // const interceptorFunctionList = SIDECAR_METADATA.interceptorList

  const FIXTURES: [SidecarMetadataFunctionDescription, string][] = [
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
        'const anotherCall_JsArg_0 = args[0].readInt()',
        'const anotherCall_JsArg_1 = args[1].readPointer().readUtf8String()',
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
        'const testMethod_JsArg_0 = args[0].readUtf8String()',
        'const testMethod_JsArg_1 = args[1]',
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
        'const pointerMethod_JsArg_0 = args[0]',
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
    [
      {
        name: 'hookMethod',
        paramTypeList: [
          [
            'int',
          ],
          [
            'pointer',
            'Utf8String',
          ],
        ],
        target: {
          address: '0x17',
          moduleName: null,
          type: 'address',
        },
      },
      [
        'const hookMethod_JsArg_0 = args[0]',
        'const hookMethod_JsArg_1 = args[1].readUtf8String()',
      ].join('\n'),
    ],
  ]

  // const result = [
  //   ...nativeFunctionList,
  //   ...interceptorFunctionList,
  // ].map(x => Object.values(x))
  //   .flat()
  //   .map(x => jsArgs.call(x))
  // void jsArgs

  // console.log(JSON.stringify(result, null, 2))

  for (const [fixture, expected] of FIXTURES) {
    const result = declareJsArgs.call(fixture)
    t.equal(result, expected, `"${fixture.name}" args declared correct`)
  }
  // t.same(result, EXPECTED_ARGS_LIST, 'should wrap the args correct')
})
