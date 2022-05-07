/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
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
import {
  createReducer,
  ActionType,
}                     from 'typesafe-actions'
import type {
  DeepReadonly,
}                     from 'utility-types'

import type * as PUPPET from 'wechaty-puppet'

import * as actions from './actions.js'

type State = DeepReadonly<{
  puppet: {
    [puppetId: string]: undefined | {
      currentUser? : PUPPET.payloads.Contact,
      qrcode?      : string,
      wechatyId?   : string
    }
  }
  wechaty: {
    [wechatyId: string]: undefined | {
      puppetId?: string
    }
  },
}>

const initialState: State = {
  puppet  : {},
  wechaty : {},
}

const reducer = createReducer<typeof initialState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.SCAN_RECEIVED_EVENT, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.meta.puppetId]: {
          ...state.puppet[action.meta.puppetId],
          currentUser: undefined,
          qrcode: action.payload.qrcode,
        },
      },
    }
    return newState
  })
  .handleAction([
    actions.LOGOUT_RECEIVED_EVENT,
    actions.STOPPED_EVENT,
  ], (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.meta.puppetId]: {
          ...state.puppet[action.meta.puppetId],
          currentUser : undefined,
          qrcode      : undefined,
        },
      },
    }
    return newState
  })
  /**
   * Register & Deregister Puppet
   */
  .handleAction(actions.REGISTER_PUPPET_COMMAND, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
        },
      },
    }
    return newState
  })
  .handleAction(actions.DEREGISTER_PUPPET_COMMAND, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: undefined, // TODO: how to remove the key with `...`? Huan(202203)
      },
    }
    return newState
  })
  /**
   * Register & Deregister Wechaty
   */
  .handleAction(actions.REGISTER_WECHATY_COMMAND, (state, action) => {
    const newState: State = {
      ...state,
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: {
          ...state.wechaty[action.payload.wechatyId],
        },
      },
    }
    return newState
  })
  .handleAction(actions.DEREGISTER_WECHATY_COMMAND, (state, action) => {
    const newState: State = {
      ...state,
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: undefined,
      },
    }
    return newState
  })
  /**
   * Bind & Unbind Wechaty <> Puppet
   */
  .handleAction(actions.BIND_WECHATY_PUPPET_COMMAND, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          wechatyId: action.payload.wechatyId,
        },
      },
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: {
          ...state.wechaty[action.payload.wechatyId],
          puppetId: action.payload.puppetId,
        },
      },
    }
    return newState
  })
  .handleAction(actions.UNBIND_WECHATY_PUPPET_COMMAND, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          wechatyId: undefined,
        },
      },
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: {
          ...state.wechaty[action.payload.wechatyId],
          puppetId: undefined,
        },
      },
    }
    return newState
  })

export type {
  State,
}
export default reducer
