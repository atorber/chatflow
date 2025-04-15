import {
  Message,
  log,
}                 from 'wechaty'

import type {
  TalkerMessage,
}                 from '../types/mod.js'

type MessageMapperFunction = (message: Message) =>  TalkerMessage
                                                  | TalkerMessage[]
                                                  | Promise<
                                                        never
                                                      | TalkerMessage
                                                      | TalkerMessage[]
                                                    >
type MessageMapperOption        = TalkerMessage | MessageMapperFunction
export type MessageMapperOptions = MessageMapperOption | MessageMapperOption[]

function messageMapper (
  mapperOptions: MessageMapperOptions,
) {
  log.verbose('WechatyPluginContrib', 'messageMapper(%s)',
    typeof mapperOptions === 'function'
      ? 'function'
      : JSON.stringify(mapperOptions),
  )

  return async function mapMessage (message: Message): Promise<TalkerMessage[]> {
    log.verbose('WechatyPluginContrib', 'mapMessage(%s)', message)

    return normalizeMappedMessageList(mapperOptions, message)
  }
}

async function normalizeMappedMessageList (
  options: MessageMapperOptions,
  message: Message,
): Promise<TalkerMessage[]> {
  log.verbose('WechatyPluginContrib', 'normalizeMappedMessageList(%s, %s)',
    JSON.stringify(options),
    message,
  )

  const msgList = [] as TalkerMessage[]

  let optionList
  if (Array.isArray(options)) {
    optionList = options
  } else {
    optionList = [ options ]
  }

  for (const option of optionList) {
    if (!option) { continue }

    if (typeof option === 'function') {
      const ret = await option(message)
      if (ret) {
        msgList.push(...await normalizeMappedMessageList(ret, message))
      }
    } else {
      msgList.push(option)
    }
  }

  return msgList
}

export {
  messageMapper,
}
