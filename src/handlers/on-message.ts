import { Message, log, Wechaty, Room } from 'wechaty'
import { FileBox } from 'file-box'

import { addMessage, formatMessage } from '../api/message.js'
import { ChatFlowConfig } from '../api/base-config.js'
import type { ChatMessage } from '../types/mod.js'
import {
  sendNotice,
  wxai,
  gpt,
  gptbot,
  // propertyMessage,
  eventMessage,
  exportContactsAndRoomsToCSV,
  exportContactsAndRoomsToXLSX,
} from '../plugins/mod.js'

import { WxOpenaiBot, type WxOpenaiBotConfig, type SkillInfoArray } from '../services/wxopenaiService.js'

import {
  sendMsg,
  // updateConfig,
} from '../services/configService.js'

import {
  getNow,
  logger,
  formatTimestamp,
} from '../utils/mod.js'

import type {
  Services,
} from '../services/mod.js'
import { containsContact, containsRoom } from '../services/userService.js'
import { handleSay } from './onReadyOrLogin.js'
import { activityController } from '../services/activityService.js'
import { MqttProxy } from '../proxy/mqtt-proxy.js'

async function handleActivityManagement (message: Message) {
  const room = message.room() as Room
  const topic = await room.topic()
  const isActInRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.act, room)
  if (isActInRoomWhiteList) {
    logger.info('当前群在act白名单内，开始请求活动管理...')
    try {
      await activityController(message, room)
    } catch (e) {
      logger.error('活动管理失败', topic, e)
    }
  }
}

interface CommandActions {
    [key: string]: (bot: Wechaty, message: Message) => Promise<FileBox>
  }

async function handleAutoQA (bot: Wechaty, message: Message, keyWord: string) {
  const room = message.room() as Room
  const topic = await room.topic()
  const text = message.text()
  log.info('群消息请求智能问答：' + JSON.stringify(text === keyWord))
  if (ChatFlowConfig.configEnv.AUTOQA_AUTOREPLY) {
    const isInRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.qa, room)
    if (isInRoomWhiteList) {
      logger.info('当前群在qa白名单内，请求问答...')
      try {
        await wxai(ChatFlowConfig.configEnv, bot, message)
      } catch (e) {
        logger.error('发起请求wxai失败', topic, e)
      }
    }

    const isInGptRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.gpt, room)
    if (isInGptRoomWhiteList) {
      logger.info('当前群在qa白名单内，请求问答gpt...')
      try {
        await gpt(ChatFlowConfig.configEnv, bot, message)
      } catch (e) {
        logger.error('发起请求gpt失败', topic, e)
      }
    }
  }
}

async function handleCommand (bot: Wechaty, command: string, action: (bot: Wechaty, message: Message) => Promise<FileBox>, message: any, services: any) {
  logger.info(`Handling command: ${command}`)
  try {
    const fileBox = await action(bot, message)
    await sendMsg(message, fileBox, services.messageService)
  } catch (err) {
    logger.error(`${command} failed`, err)
    await sendMsg(message, '下载失败，请重试~', services.messageService)
  }
}

const commandActions: CommandActions = {
  下载csv通讯录: (bot: Wechaty) => exportContactsAndRoomsToCSV(bot),
  下载通讯录: (bot: Wechaty) => exportContactsAndRoomsToXLSX(bot),
  下载通知模板: () => Promise.resolve(FileBox.fromFile('./src/public/templates/群发通知模板.xlsx')),
}

const extractAtContent = async (message: Message, keyword: string, text: string): Promise<string | null> => {
  const startTag = '「'
  const endTag = '」\n'
  let newText = ''
  // 判断信息中是否是引用消息
  const startIndex = text.indexOf(startTag) + startTag.length
  const endIndex = text.indexOf(endTag, startIndex)

  // 提取「和 」之间的内容
  if (startIndex !== -1 && endIndex !== -1) {
    newText = `@${keyword}` + text.substring(startIndex, endIndex)
    logger.info('提取到的内容：' + newText)
  } else {
    logger.info('未提取到内容：' + text)
    newText = text
  }

  const query = { 'room.payload.id': message.room()?.id }
  const messageList = await ChatFlowConfig.services?.messageService.messageData
    .sort({ timestamp: -1 })
    .limit(0, 500)
    .find(query)

  logger.info('查询到的messageList长度:' + messageList.length)

  // TBD将消息转换为提示词
  const style = '详细、严谨、像真人一样表达'
  // const role = '电影《大话西游》里的唐三藏这个角色'
  const role = '智能助理'

  let p = `以下是一个群组的聊天记录，你将以“${keyword}”的身份作为群聊中的一员参与聊天。你的回复必须结合聊天历史记录和你的知识给出尽可能${style}的回答，回复字数不超过150字，并且听起来语气口吻像${role}的风格。\n\n`

  const time = formatTimestamp(new Date().getTime())[5]
  let chatText = ''
  for (const i in messageList) {
    const item = messageList[i]
    if (chatText.length < 2000 && item.data.payload.type === 7) {
      chatText = `[${item.time || time} ${item.talker.payload.name}]:${item.data.payload.text}\n` + chatText
    } else { /* empty */ }
  }
  // chatText = chatText + `[${time} ${message.talker().name()}]：${newText}\n`
  // chatText = chatText + `[${time} ${keyword}]：`

  p = p + chatText

  p = `微信群聊天记录:\n${chatText}\n\n指令:\n你是微信聊天群里的成员【${keyword}】，你正在参与大家的群聊天，先在轮到你发言了，你的回复尽可能清晰、严谨，字数不超过150字，并且你需要使用${role}的风格回复。当前时间是${time}。`

  p = p + `\n\n最新的对话:\n[${time} ${message.talker().name()}]：${newText}\n[${time} ${keyword}]：`
  logger.info('提示词：' + p)

  const answer = await gptbot(process.env, p)

  if (answer.text && answer.text.length > 0) {
    await handleSay(message, answer.text)
    // await message.say(answer.text)
  } else {
    await handleSay(message, `${keyword}走神了，再问一次吧~`)
    // await message.say(`${keyword}走神了，再问一次吧~`)
  }
  return null
}

// 封装成一个函数来处理错误和成功的消息发送
async function sendReplyMessage (message: Message, success: boolean, successMsg: string, errorMsg: string) {
  const replyText = success ? successMsg : errorMsg
  await sendMsg(message, getNow() + replyText, (ChatFlowConfig.services as Services).messageService)
}

async function handleAdminRoomSetting (message: Message) {
  const text = message.text()
  const room = message.room() as Room
  if (message.self() && text === '设置为管理群') {
    ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID = room.id
    ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC = await room.topic()
    // await updateConfig(ChatFlowConfig.configEnv)
    await sendMsg(message, '设置管理群成功', (ChatFlowConfig.services as Services).messageService)
  }
}

interface AdminCommands {
    [key: string]: (bot: Wechaty, message: Message) => Promise<[boolean, string]>;
  }
// 使用一个对象来存储命令和对应的处理函数
const adminCommands: AdminCommands = {
  更新配置: async () => {
    try {
      const botConfig = await ChatFlowConfig.envService.downConfigFromVika()
      logger.info('botConfig:' + JSON.stringify(botConfig))
      return [ true, '配置更新成功~' ]
    } catch (e) {
      return [ false, '配置更新失败~' ]
    }
  },
  更新定时提醒: async (bot: Wechaty) => {
    try {
      await (ChatFlowConfig.services as Services).noticeService.updateJobs(bot, (ChatFlowConfig.services as Services).messageService)
      return [ true, '提醒任务更新成功~' ]
    } catch (e) {
      return [ false, '提醒任务更新失败~' ]
    }
  },
  更新通讯录: async (bot: Wechaty) => {
    try {
      await (ChatFlowConfig.services as Services).contactService.updateContacts(bot, ChatFlowConfig.configEnv.WECHATY_PUPPET)
      await (ChatFlowConfig.services as Services).roomService.updateRooms(bot, ChatFlowConfig.configEnv.WECHATY_PUPPET)
      return [ true, '通讯录更新成功~' ]
    } catch (e) {
      return [ false, '通讯录更新失败~' ]
    }
  },
  更新白名单: async (_bot: Wechaty) => {
    try {
      ChatFlowConfig.whiteList = await (ChatFlowConfig.services as Services).whiteListService.getWhiteList()
      return [ true, '热更新白名单~' ]
    } catch (e) {
      return [ false, '白名单更新失败~' ]
    }
  },
  更新活动: async (_bot: Wechaty) => {
    try {
      await (ChatFlowConfig.services as Services).activityService.getStatistics()
      return [ true, '热更新活动~' ]
    } catch (e) {
      return [ false, '活动更新失败~' ]
    }
  },
  群发通知: async (bot: Wechaty) => {
    try {
      const replyText = await (ChatFlowConfig.services as Services).groupNoticeService.pubGroupNotifications(bot, (ChatFlowConfig.services as Services).messageService)
      return [ true, replyText ]
    } catch (e) {
      return [ false, '群发通知失败~' ]
    }
  },
  更新问答: async (_bot: Wechaty) => {
    let replyText = ''
    try {
      const skills: SkillInfoArray = await (ChatFlowConfig.services as Services).qaService.getQa()
      if (skills.length) {
        const config: WxOpenaiBotConfig = {
          encodingAESKey: ChatFlowConfig.configEnv.WXOPENAI_ENCODINGAESKEY || '',
          token: ChatFlowConfig.configEnv.WXOPENAI_TOKEN || '',
          nonce: 'ABSBSDSD',
          appid: ChatFlowConfig.configEnv.WXOPENAI_APPID || '',
          managerid: ChatFlowConfig.configEnv.WXOPENAI_MANAGERID || '',
        }

        const aiBotInstance = new WxOpenaiBot(config)
        const result: any = await aiBotInstance.updateSkill(skills, 1)
        if (result.data && result.data.task_id) {
          const res = await aiBotInstance.publishSkill()
          console.info('发布技能成功:', res)
          replyText = '更新问答列表成功~'

        } else {
          // eslint-disable-next-line no-console
          console.error('更新问答失败Error:', result)
          replyText = '更新问答列表失败~'
        }
      } else {
        replyText = '问答列表为空，未更新任何内容~'
      }
      return [ true, replyText ]
    } catch (e) {
      return [ false, '问答列表更新失败~' ]
    }
  },
  报名活动: async (_bot: Wechaty, message: Message) => {
    try {
      await (ChatFlowConfig.services as Services).activityService.createOrder(message)
      return [ true, '报名成功~' ]
    } catch (e) {
      return [ false, '报名失败~' ]
    }
  },
  上传配置: async () => {
    try {
      await ChatFlowConfig.envService.updateConfigToVika(ChatFlowConfig.configEnv)

      return [ true, '上传配置信息成功~' ]
    } catch (e) {
      return [ false, '上传配置信息失败~' ]
    }
  },
  下载配置: async () => {
    try {
      const botConfig = await ChatFlowConfig.envService.downConfigFromVika()
      logger.info('botConfig:' + JSON.stringify(botConfig))
      return [ true, '下载配置信息成功~' ]
    } catch (e) {
      return [ false, '下载配置信息失败~' ]
    }
  },
}

async function handleAutoQAForContact (bot: Wechaty, message: Message, keyWord: string) {
  const talker = message.talker()
  const text = message.text()
  logger.info('联系人请求智能问答：' + (text === keyWord))
  if (ChatFlowConfig.configEnv.AUTOQA_AUTOREPLY) {
    const isInContactWhiteList = await containsContact(ChatFlowConfig.whiteList.contactWhiteList.qa, talker)
    if (isInContactWhiteList) {
      logger.info('当前好友在qa白名单内，请求问答...')
      try {
        await wxai(ChatFlowConfig.configEnv, bot, message)
      } catch (e) {
        logger.error('发起请求wxai失败', talker.name(), e)
      }
    } else {
      logger.info('当前好友不在qa白名单内，流程结束')
    }
    const isInGptContactWhiteList = await containsContact(ChatFlowConfig.whiteList.contactWhiteList.gpt, talker)
    if (isInGptContactWhiteList) {
      logger.info('当前好友在qa白名单内，请求问答gpt...')
      try {
        await gpt(ChatFlowConfig.configEnv, bot, message)
      } catch (e) {
        logger.error('发起请求wxai失败', talker.name(), e)
      }
    } else {
      logger.info('当前好友不在gpt白名单内，gpt流程结束')
    }
  }
}

export async function onMessage (message: Message) {
  const bot = ChatFlowConfig.bot
  // if (message.type() === types.Message.Text) {
  //   logger.info('onMessage,接收到消息:\n' + JSON.stringify(message.payload))
  // } else {
  //   logger.info('onMessage,接收到消息:\n' + JSON.stringify(message.payload))
  // }

  // 存储消息到db，如果写入失败则终止
  const addRes = await addMessage(message)
  if (!addRes || !ChatFlowConfig.services) return

  const text = message.text()
  const talker = message.talker()
  const listener = message.listener()
  const room = message.room()
  const roomId = room?.id
  const topic = await room?.topic()
  const type = message.type()
  const keyWord = bot.currentUser.name()
  const isSelf = message.self()
  const isAdminRoom: boolean = (roomId && (roomId === ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID || topic === ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC)) || isSelf

  const chatMessage: ChatMessage = {
    id: message.id,
    text,
    type,
    talker: {
      name: talker.name(),
      id: talker.id,
      alias: await talker.alias(),
    },
    room: {
      topic,
      id: room?.id,
    },
    listener: {
      id: listener?.id,
      name: listener?.name(),
      alias: await listener?.alias(),
    },
  }

  // logger.info('bot onMessage,接收到消息,chatMessage:\n' + JSON.stringify(chatMessage))
  log.info('bot onMessage,接收到消息,chatMessage:\n' + JSON.stringify(chatMessage))

  // 管理员群接收到管理指令时执行相关操作
  if (isAdminRoom) {
    if (message.type() === bot.Message.Type.Attachment) {
      await sendNotice(bot, message)
    }

    if (text === '帮助') {
      const replyText = await (ChatFlowConfig.services as Services).keywordService.getSystemKeywordsText()
      await sendMsg(message, replyText, (ChatFlowConfig.services as Services).messageService)
    } else if (Object.prototype.hasOwnProperty.call(adminCommands, text)) {
      const command = adminCommands[text as keyof typeof adminCommands]
      if (typeof command === 'function') {
        const [ success, replyText ] = await command(bot, message)
        await sendReplyMessage(message, success, replyText, replyText)
      }
    }

    if ([ '更新配置', '更新定时提醒', '更新通讯录' ].includes(text) && !ChatFlowConfig.configEnv.VIKA_TOKEN) {
      await sendMsg(message, '未配置维格表，指令无效', (ChatFlowConfig.services as Services).messageService)
    }

    if (Object.prototype.hasOwnProperty.call(commandActions, text)) {
      const command = commandActions[text]
      if (typeof command === 'function') {
        await handleCommand(bot, text, command, message, ChatFlowConfig.services)
      }
    }
  }

  // 群消息处理
  if (room && room.id) {
    if (!isSelf) {
      await handleAutoQA(bot, message, keyWord)
      await handleActivityManagement(message)
      if (text.indexOf(`@${keyWord}`) !== -1) {
        await extractAtContent(message, keyWord, text)
      }
    }
    await handleAdminRoomSetting(message)
  }

  // 非群消息处理
  if ((!room || !room.id) && !isSelf) {
    await handleAutoQAForContact(bot, message, keyWord)
  }

  // 消息存储到维格表
  if (ChatFlowConfig.configEnv.VIKA_UPLOADMESSAGETOVIKA) {
    // logger.info('消息同步到维格表...')
    await (ChatFlowConfig.services as Services).messageService.onMessage(message)
  }

  const mqttProxy = MqttProxy.getInstance()
  // 消息通过MQTT上报
  if (mqttProxy && mqttProxy.isOk && ChatFlowConfig.configEnv.MQTT_MQTTMESSAGEPUSH) {
    /*
            将消息通过mqtt通道上报到云端
            */
    // mqttProxy.pubMessage(message)

    mqttProxy.pubEvent(eventMessage('onMessage', await formatMessage(message)))
  }

}
