import type { SidecarMetadata } from '../decorators/sidecar/metadata-sidecar.js'

import { declareJsArgs }          from './declare-js-args.js'
import { declareNativeArgs }      from './declare-native-args.js'
import { jsArgs }                 from './js-args.js'
import { jsRet }                  from './js-ret.js'
import { logLevel }               from './log-level.js'
import { moduleName }             from './module-name.js'
import { nativeArgs }             from './native-args.js'
import { nativeFunctionNameList } from './native-function-name-list.js'
import { nativeParamTypes }       from './native-param-types.js'
import { nativeRetType }          from './native-ret-type.js'

const wrapView = (metadata: SidecarMetadata) => ({
  ...metadata,
  declareJsArgs,
  declareNativeArgs,
  jsArgs,
  jsRet,
  logLevel,
  moduleName,
  nativeArgs,
  nativeFunctionNameList,
  nativeParamTypes,
  nativeRetType,
})

export { wrapView }
