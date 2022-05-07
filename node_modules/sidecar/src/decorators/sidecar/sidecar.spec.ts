#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test }  from 'tstest'

import { Ret } from '../../ret.js'
import { SidecarBody } from '../../sidecar-body/sidecar-body.js'
import { Call } from '../call/call.js'
import { Hook } from '../hook/hook.js'
import { ParamType } from '../param-type/param-type.js'
import { RetType } from '../ret-type/ret-type.js'
import { getMetadataSidecar } from './metadata-sidecar.js'

import { Sidecar } from './sidecar.js'

const getFixture = () => {
  @Sidecar('chatbox')
  class Test extends SidecarBody {

    @Call(0x42)
    @RetType('pointer', 'Utf8String')
    testMethod (
      @ParamType('pointer', 'Utf8String') content: string,
      @ParamType('int') n: number,
    ): Promise<string> { return Ret(content, n) }

    @Hook(0x17)
    hookMethod (
      @ParamType('int') n: number,
    ) { return Ret(n) }

    // Huan(202106) TODO: support { label }
    // @Call({ label: 'label1' }) anotherCall () { return Ret() }

  }

  return Test
}

test('@Sidecar() smoke testing', async t => {

  @Sidecar('chatbox') class Test extends SidecarBody {}

  const test = new Test()

  t.equal(Test.name, 'Test', 'should have the original class name after @Sidecar decorated')
  t.ok(test, 'should instanciate decorated class successfully')
})

test('@Sidecar() viewMetadata()', async t => {

  const Test = getFixture()

  const metadata = getMetadataSidecar(Test)
  const EXPECTED_DATA = {
    initAgentScript: undefined,
    interceptorList: [
      {
        address: {
          name: 'hookMethod',
          paramTypeList: [
            [
              'int',
            ],
          ],
          retType: undefined,
          target: { address: '0x17', moduleName: null, type: 'address' },
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
    ],
    sidecarTarget: {
      target: 'chatbox',
      type: 'process',
    },
  }

  t.same(metadata, EXPECTED_DATA, 'should get view from metadata correct')
})
