/**
 * Author: Huan LI https://github.com/huan
 * Date: Apr 2020
 */
/* eslint-disable sort-keys */
import {
  Wechaty,
  WechatyPlugin,
  Message,
  types,
  log,
}                   from 'wechaty'

export interface DingDongConfigObject {
  /**
   * Whether response to the self message
   */
  self: boolean,
  /**
   * Whether response the Room Message with mention self.
   * Default: true
   */
  mention: boolean,
}

export type DingDongConfig = Partial<DingDongConfigObject>

const DEFAULT_CONFIG: DingDongConfigObject = {
  mention : false,
  self    : true,
}

const isMatchConfig = (config: DingDongConfigObject) => {
  log.verbose('DingDong', ' isMatchConfig(%s)', JSON.stringify(config))

  return async function isMatch (message: Message) {
    log.verbose('DingDong', 'isMatchConfig() isMatch(%s)', message.toString())

    return true
  }
}

function DingDong (config?: DingDongConfig): WechatyPlugin {
  log.verbose('DingDong', 'DingDong(%s)',
    typeof config === 'undefined' ? ''
      : typeof config === 'function' ? 'function'
        : JSON.stringify(config),
  )

  const normalizedConfig: DingDongConfigObject = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  const isMatch  = isMatchConfig(normalizedConfig)

  return function DingDongPlugin (wechaty: Wechaty) {
    log.verbose('DingDong', 'installing on %s ...', wechaty)

    wechaty.on('message', async message => {
      if (message.type() !== types.Message.Text) {
        return
      }

      if (!await isMatch(message)) {
        return
      }

      await message.say('dong')
    })
  }

}

export {
  DingDong,
}
