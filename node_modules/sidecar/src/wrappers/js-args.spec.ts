#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

// import { getSidecarMetadataFixture } from '../../tests/fixtures/sidecar-metadata.fixture.js'
import type { SidecarMetadataFunctionDescription } from '../decorators/mod.js'

import { jsArgs } from './js-args.js'

test('jsArgs()', async t => {
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
      '[ anotherCall_JsArg_0, anotherCall_JsArg_1 ]',
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
      '[ testMethod_JsArg_0, testMethod_JsArg_1 ]',
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
      '[ pointerMethod_JsArg_0 ]',
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
      '[  ]',
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
      '[  ]',
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
      '[ hookMethod_JsArg_0, hookMethod_JsArg_1 ]',
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
    const result = jsArgs.call(fixture)
    t.equal(result, expected, `"${fixture.name}" converted args correct`)
  }
  // t.same(result, EXPECTED_ARGS_LIST, 'should wrap the args correct')
})
