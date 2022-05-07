#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import { Ret } from '../../ret.js'
import { Call } from '../call/call.js'
import { Hook } from '../hook/hook.js'
import { ParamType } from '../param-type/param-type.js'
import { RetType } from '../ret-type/ret-type.js'

import {
  buildSidecarMetadata,
}                         from './build-sidecar-metadata.js'

import { Sidecar } from './sidecar.js'
import { SidecarBody } from '../../sidecar-body/mod.js'
import {
  agentTarget,
  exportTarget,
}                   from '../../function-target.js'

const getFixture = () => {
  @Sidecar('chatbox')
  class Test extends SidecarBody {

    @Call(0x42)
    @RetType('pointer', 'Utf8String')
    testMethod (
      @ParamType('pointer', 'Utf8String') content: string,
      @ParamType('int') n: number,
    ): Promise<string> { return Ret(content, n) }

    @Hook(agentTarget('agentVar'))
    hookMethod (
      @ParamType('int') n: number,
    ) { return Ret(n) }

    @Call(exportTarget('exportNameTest', 'moduleNameTest'))
    @RetType('pointer', 'Int')
    anotherCall (
      @ParamType('pointer', 'Int') i: number,
    ): Promise<number> { return Ret(i) }

  }

  return Test
}

test('@Sidecar() buildSidecarMetadata()', async t => {

  const Test = getFixture()

  const meta = buildSidecarMetadata(Test, {
    sidecarTarget: 'chatbox',
  })
  const EXPECTED_DATA = {
    initAgentScript: undefined,
    interceptorList: [
      {
        agent: {
          name: 'hookMethod',
          paramTypeList: [
            [
              'int',
            ],
          ],
          retType: undefined,
          target: { funcName: 'agentVar', type: 'agent' },
        },
      },
    ],
    nativeFunctionList: [
      {
        address: {
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
          target: { address: '0x42', moduleName: null, type: 'address' },
        },
      },
      {
        export: {
          name: 'anotherCall',
          paramTypeList: [
            [
              'pointer',
              'Int',
            ],
          ],
          retType: [
            'pointer',
            'Int',
          ],
          target: { exportName: 'exportNameTest', moduleName: 'moduleNameTest', type: 'export' },
        },
      },
    ],
    sidecarTarget: {
      target: 'chatbox',
      type: 'process',
    },
  }

  t.same(meta, EXPECTED_DATA, 'should get metadata correct')
})
