/* eslint-disable brace-style */
import {
  Message,
  log,
}               from 'wechaty'
import Mustache from  'mustache'

import * as mapper from '../mappers/message-mapper.js'

export type MessageTalkerOptions = mapper.MessageMapperOptions

export function messageTalker<T = void> (options?: MessageTalkerOptions) {
  log.verbose('WechatyPluginContrib', 'messageTalker(%s)', JSON.stringify(options))

  if (!options) {
    return () => undefined
  }

  const mapMessage = mapper.messageMapper(options)

  return async function talkMessage (message: Message, mustacheView: T): Promise<void> {
    log.silly('WechatyPluginContrib', 'messageTalker() talkMessage(%s, %s)',
      message,
      mustacheView
        ? JSON.stringify(mustacheView)
        : '',
    )

    const msgList = await mapMessage(message)

    for (const msg of msgList) {
      if (!msg) { continue }

      if (typeof msg === 'string') {

        let text = msg
        if (mustacheView) {
          text = Mustache.render(msg, mustacheView)
        }
        await message.say(text)

      } else {
        /**
         *  FIXME(huan): https://github.com/microsoft/TypeScript/issues/14107
         */
        await message.say(msg as any)
      }

      await message.wechaty.sleep(1000)
    }
  }
}
