#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

// tslint:disable:no-shadowed-variable
import { test }  from 'tstest'

import type {
  FileBoxInterface,
}                         from './interface.js'

import {
  FileBox,
}           from './file-box.js'

test('FileBoxInterface', async t => {
  const fileBox: FileBoxInterface = FileBox.fromQRCode('test')
  t.ok(fileBox, 'should be ok with interface')
})
