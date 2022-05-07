/**
 *   Sidecar - https://github.com/huan/sidecar
 *
 *   @copyright 2021 Huan LI (李卓桓) <https://github.com/huan>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { VERSION }      from './version.js'
import { Ret }          from './ret.js'
import {
  SidecarBody,
  attach,
  detach,
}                       from './sidecar-body/mod.js'

import {
  INIT_SYMBOL,
  ATTACH_SYMBOL,
  DETACH_SYMBOL,

  SCRIPT_DESTROYED_HANDLER_SYMBOL,
  SCRIPT_MESSAGRE_HANDLER_SYMBOL,

  LOG_EVENT_HANDLER,
  HOOK_EVENT_HANDLER,
}                                     from './sidecar-body/constants.js'

/**
 * Decorators
 */
import { Call }       from './decorators/call/mod.js'
import { Hook }       from './decorators/hook/mod.js'
import { ParamType }  from './decorators/param-type/mod.js'
import { RetType }    from './decorators/ret-type/mod.js'
import { Sidecar }    from './decorators/sidecar/mod.js'

/**
 * Target helpers
 */
import {
  addressTarget,
  agentTarget,
  exportTarget,
  FunctionTarget,
}                     from './function-target.js'

const debug = {
  ATTACH_SYMBOL,
  DETACH_SYMBOL,
  HOOK_EVENT_HANDLER,
  INIT_SYMBOL,
  LOG_EVENT_HANDLER,
  SCRIPT_DESTROYED_HANDLER_SYMBOL,
  SCRIPT_MESSAGRE_HANDLER_SYMBOL,
}

export type {
  FunctionTarget,
}
export {
  addressTarget,
  agentTarget,
  attach,
  Call,
  debug,
  detach,
  exportTarget,
  Hook,
  ParamType,
  Ret,
  RetType,
  Sidecar,
  SidecarBody,
  VERSION,
}
