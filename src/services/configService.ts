/* eslint-disable sort-keys */
import { Contact, Message, Room, Sayable, log } from 'wechaty'
// import fs from 'fs'
import { MessageChat } from './messageService.js'

// 配置机器人
export function getBotOps (puppet: string, token: string) {
  const ops: any = {
    name: 'chatflow',
    puppet,
    puppetOptions: {
      token,
    },
  }

  if (puppet === 'wechaty-puppet-service') {
    process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
    process.env['WECHATY_PUPPET_SERVICE_AUTHORITY'] = 'token-service-discovery-test.juzibot.com'
  }

  if ([ 'wechaty-puppet-wechat4u', 'wechaty-puppet-xp', 'wechaty-puppet-engine' ].includes(puppet)) {
    delete ops.puppetOptions.token
  }

  if (puppet === 'wechaty-puppet-wechat') {
    delete ops.puppetOptions.token
    ops.puppetOptions.uos = true
  }
  return ops
}

// 消息发布器
export const sendMsg = async (publisher: Message | Room | Contact, sayable: Sayable, inviteeList?: Contact[]) => {
  try {
    let replyMessage: Message | void
    if (inviteeList?.length) {
      const text = sayable as string
      replyMessage = await (publisher as Room).say(text, ...inviteeList)
    } else {
      replyMessage = await publisher.say(sayable)
    }
    if (replyMessage) {
      await MessageChat.onMessage(replyMessage)
    }
  } catch (e) {
    log.error('消息发送失败:', publisher, sayable, e)
  }
}
