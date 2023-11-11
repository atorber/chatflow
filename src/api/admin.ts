import { Message, log, Wechaty, Room } from 'wechaty'
import { FileBox } from 'file-box'
import { ChatFlowConfig } from '../api/base-config.js'
import {
  sendNotice,
  exportContactsAndRoomsToCSV,
  exportContactsAndRoomsToXLSX,
} from '../plugins/mod.js'

import {
  sendMsg,
  // updateConfig,
} from '../services/configService.js'

import {
  EnvChat,
  NoticeChat,
  ContactChat,
  RoomChat,
  ActivityChat,
  WhiteListChat,
  GroupNoticeChat,
  QaChat,
  KeywordChat,
} from '../services/mod.js'

import {
  getNow,
  logger,
} from '../utils/mod.js'

import { WxOpenaiBot, type WxOpenaiBotConfig, type SkillInfoArray } from '../services/wxopenaiService.js'

interface CommandActions {
    [key: string]: (bot: Wechaty, message: Message) => Promise<FileBox>
  }

interface AdminCommands {
    [key: string]: (bot: Wechaty, message: Message) => Promise<[boolean, string]>;
  }
// 使用一个对象来存储命令和对应的处理函数
const adminCommands: AdminCommands = {
  更新配置: async () => {
    try {
      const botConfig = await EnvChat.downConfigFromVika()
      log.info('botConfig:', JSON.stringify(botConfig))
      return [ true, '配置更新成功~' ]
    } catch (e) {
      return [ false, '配置更新失败~' ]
    }
  },
  更新定时提醒: async () => {
    try {
      await NoticeChat.updateJobs()
      return [ true, '提醒任务更新成功~' ]
    } catch (e) {
      return [ false, '提醒任务更新失败~' ]
    }
  },
  更新通讯录: async () => {
    try {
      await ContactChat.updateContacts(ChatFlowConfig.configEnv.WECHATY_PUPPET)
      await RoomChat.updateRooms(ChatFlowConfig.configEnv.WECHATY_PUPPET)
      return [ true, '通讯录更新成功~' ]
    } catch (e) {
      return [ false, '通讯录更新失败~' ]
    }
  },
  更新白名单: async () => {
    try {
      ChatFlowConfig.whiteList = await WhiteListChat.getWhiteList()
      return [ true, '热更新白名单~' ]
    } catch (e) {
      return [ false, '白名单更新失败~' ]
    }
  },
  更新活动: async () => {
    try {
      await ActivityChat.getStatistics()
      return [ true, '热更新活动~' ]
    } catch (e) {
      return [ false, '活动更新失败~' ]
    }
  },
  群发通知: async () => {
    try {
      const replyText = await GroupNoticeChat.pubGroupNotifications()
      return [ true, replyText ]
    } catch (e) {
      return [ false, '群发通知失败~' ]
    }
  },
  更新问答: async () => {
    let replyText = ''
    try {
      const skills: SkillInfoArray = await QaChat.getQa()
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
  报名活动: async (_bot:Wechaty, message: Message) => {
    try {
      await ActivityChat.createOrder(message)
      return [ true, '报名成功~' ]
    } catch (e) {
      return [ false, '报名失败~' ]
    }
  },
  上传配置: async () => {
    try {
      await EnvChat.updateConfigToVika(ChatFlowConfig.configEnv)

      return [ true, '上传配置信息成功~' ]
    } catch (e) {
      return [ false, '上传配置信息失败~' ]
    }
  },
  下载配置: async () => {
    try {
      const botConfig = await EnvChat.downConfigFromVika()
      log.info('botConfig:', JSON.stringify(botConfig))
      return [ true, '下载配置信息成功~' ]
    } catch (e) {
      return [ false, '下载配置信息失败~' ]
    }
  },
}

// 封装成一个函数来处理错误和成功的消息发送
async function sendReplyMessage (message: Message, success: boolean, successMsg: string, errorMsg: string) {
  const replyText = success ? successMsg : errorMsg
  await sendMsg(message, getNow() + replyText)
}

async function handleAdminRoomSetting (message: Message) {
  const text = message.text()
  const room = message.room() as Room
  if (message.self() && text === '设置为管理群') {
    ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID = room.id
    ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC = await room.topic()
    // await updateConfig(ChatFlowConfig.configEnv)
    await sendMsg(message, '设置管理群成功')
  }
}

export const adminAction = async (message:Message) => {

  const text = message.text()
  const room = message.room()
  const roomId = room?.id
  const topic = await room?.topic()
  const isSelf = message.self()

  const isAdminRoom: boolean = (roomId && (roomId === ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID || topic === ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC)) || isSelf
  // 管理员群接收到管理指令时执行相关操作
  if (isAdminRoom) {
    if (message.type() === ChatFlowConfig.bot.Message.Type.Attachment) {
      await sendNotice(ChatFlowConfig.bot, message)
    }

    if (text === '帮助') {
      const replyText = await KeywordChat.getSystemKeywordsText()
      await sendMsg(message, replyText)
    } else if (Object.prototype.hasOwnProperty.call(adminCommands, text)) {
      const command = adminCommands[text as keyof typeof adminCommands]
      if (typeof command === 'function') {
        const [ success, replyText ] = await command(ChatFlowConfig.bot, message)
        await sendReplyMessage(message, success, replyText, replyText)
      }
    }

    if ([ '更新配置', '更新定时提醒', '更新通讯录' ].includes(text) && !ChatFlowConfig.configEnv.VIKA_TOKEN) {
      await sendMsg(message, '未配置维格表，指令无效')
    }

    const commandActions: CommandActions = {
      下载csv通讯录: (bot: Wechaty) => exportContactsAndRoomsToCSV(bot),
      下载通讯录: (bot: Wechaty) => exportContactsAndRoomsToXLSX(bot),
      下载通知模板: () => Promise.resolve(FileBox.fromFile('./src/public/templates/群发通知模板.xlsx')),
    }

    if (Object.prototype.hasOwnProperty.call(commandActions, text)) {
      const command = commandActions[text]
      if (typeof command === 'function') {
        try {
          const fileBox = await command(ChatFlowConfig.bot, message)
          await sendMsg(message, fileBox)
        } catch (err) {
          logger.error(`${command} failed`, err)
          await sendMsg(message, '下载失败，请重试~')
        }
      }
    }
  }

  // 群消息处理
  if (room && room.id) {
    await handleAdminRoomSetting(message)
  }

}
