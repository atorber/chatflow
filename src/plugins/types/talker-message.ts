import type {
  Sayable,
  Message,
}                   from 'wechaty'
import {
  types,
  log,
}                   from 'wechaty'

/**
 *  1. `void` & `undefined` means drop the message
 *  1. `Message` means forward the original message
 */
type TalkerMessage = void | undefined | Sayable

async function talkerMessageFrom (message: Message): Promise<TalkerMessage> {
  const msgType = message.type()
  switch (msgType) {
    case types.Message.Text:
      return message.text()
    case types.Message.Image:
    case types.Message.Attachment:
    case types.Message.Audio:
    case types.Message.Video:
    case types.Message.Emoticon:
      return message.toFileBox()
    case types.Message.Contact:
      return message.toContact()
    case types.Message.Url:
      return message.toUrlLink()
    case types.Message.MiniProgram:
      return message.toMiniProgram()

    default:
      log.silly('Wechaty', 'talkerMessageFrom(%s) non-convertible type: %s', message, msgType)
      return undefined
  }
}

export type {
  TalkerMessage,
}
export {
  talkerMessageFrom,
}
