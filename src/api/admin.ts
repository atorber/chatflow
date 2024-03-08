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
  ActivityChat,
  GroupNoticeChat,
  QaChat,
} from '../services/mod.js'

import {
  getNow,
  logger,
} from '../utils/mod.js'

import { WxOpenaiBot, type WxOpenaiBotConfig, type SkillInfoArray } from '../services/wxopenaiService.js'
import { ServeGetChatbotUsersDetail } from '../api/chatbot.js'
import { ServeGetWhitelistWhiteObject } from '../api/white-list.js'
interface CommandActions {
    [key: string]: (bot: Wechaty, message: Message) => Promise<FileBox>
  }

interface AdminCommands {
    [key: string]: (bot: Wechaty, message: Message) => Promise<[boolean, string]>;
  }
// 使用一个对象来存储命令和对应的处理函数
const adminCommands: AdminCommands = {
  更新智聊用户: async () => {
    try {
      const chatBotUsers = await ServeGetChatbotUsersDetail()
      ChatFlowConfig.chatBotUsers = chatBotUsers.data.items
      logger.info('获取到智聊用户信息:' + JSON.stringify(ChatFlowConfig.chatBotUsers))
      return [ true, '智聊用户列表更新成功~' ]
    } catch (e) {
      return [ false, '智聊用户列表配置更新失败~' ]
    }
  },
  更新配置: async () => {
    try {
      const res = await EnvChat.getConfigFromVika()
      logger.info('ServeGetUserConfig res:' + JSON.stringify(res))

      const vikaConfig:any = res.data
      // logger.info('获取的维格表中的环境变量配置信息vikaConfig：' + JSON.stringify(vikaConfig))

      // 合并配置信息，如果维格表中有对应配置则覆盖环境变量中的配置
      ChatFlowConfig.configEnv = { ...vikaConfig, ...(ChatFlowConfig.configEnv) }
      logger.info('合并后的环境变量信息：' + JSON.stringify(ChatFlowConfig.configEnv))
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
      await ChatFlowConfig.updateContacts(ChatFlowConfig.configEnv.WECHATY_PUPPET)
      await ChatFlowConfig.updateRooms(ChatFlowConfig.configEnv.WECHATY_PUPPET)
      return [ true, '通讯录更新成功~' ]
    } catch (e) {
      return [ false, '通讯录更新失败~' ]
    }
  },
  更新白名单: async () => {
    try {
      const res = await ServeGetWhitelistWhiteObject()
      ChatFlowConfig.whiteList = res.data
      logger.info('获取到白名单信息:' + JSON.stringify(ChatFlowConfig.whiteList))
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
    if (ChatFlowConfig.configEnv.WXOPENAI_APPID && ChatFlowConfig.configEnv.WXOPENAI_MANAGERID) {
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
            log.info('发布技能成功:', res)
            replyText = '更新问答列表成功~'

          } else {
            // eslint-disable-next-line no-console
            log.error('更新问答失败Error:', result)
            replyText = '更新问答列表失败~'
          }
        } else {
          replyText = '问答列表为空，未更新任何内容~'
        }
        return [ true, replyText ]
      } catch (e) {
        return [ false, '问答列表更新失败~' ]
      }
    } else {
      return [ false, '微信对话平台配置信息不全，请检查配置信息~' ]
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
      const replyText = await ChatFlowConfig.getSystemKeywordsText()
      await sendMsg(message, replyText)
    } else if (Object.prototype.hasOwnProperty.call(adminCommands, text)) {
      const command = adminCommands[text as keyof typeof adminCommands]
      if (typeof command === 'function') {
        const [ success, replyText ] = await command(ChatFlowConfig.bot, message)
        await sendReplyMessage(message, success, replyText, replyText)
      }
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

    // 检测链接进行管理操作
    try {
      // 处理多维表格设置,如果text中包含https://oou2hscgt2.feishu.cn/或https://vika.cn/则从text中提取多维表格的配置信息
    // 维格表配置信息格式：https://vika.cn/workbench/dstZmz6jDv4H2Ym3qd/viwlGB2EZh1W7?spaceId=spcj6bgt12WoZ，提取结果为：{spaceId: 'spcj6bgt12WoZ', table: 'dstZmz6jDv4H2Ym3qd', view: 'viwlGB2EZh1W7'}
    // 飞书多维表格配置信息格式：https://oou2hscgt2.feishu.cn/base/bascnPgZURujrdwZ9T4JkLUSUQc?table=tbl90nnja6sqMuCT&view=vewmgp68n9，提取结果为：{spaceId: 'bascnPgZURujrdwZ9T4JkLUSUQc', table: 'tbl90nnja6sqMuCT', view: 'vewmgp68n9'}
      const VIKA_BASE_STRING = 'https://vika.cn/workbench/'
      const LARK_BASE_STRING = '.feishu.cn/base/'
      if (text.includes(VIKA_BASE_STRING) || text.includes(LARK_BASE_STRING)) {
        const config: {
        url: string;
        spaceId: string | undefined;
        table: string | undefined;
        view: string | undefined;
      } = { url:'', spaceId: '', table: '', view: '' }
        const vikaConfigWithSpaceId = text.match(/https:\/\/vika.cn\/workbench\/(.*?)\/(.*)\?spaceId=(.*)/)
        log.info('vikaConfig:', vikaConfigWithSpaceId || '不是维格表链接')

        const vikaConfigNoSpaceId = text.match(/https:\/\/vika.cn\/workbench\/(.*?)\/(.*)/)
        log.info('vikaConfig:', vikaConfigNoSpaceId || '不是维格表链接')

        const larkConfig = text.match(/.feishu.cn\/base\/(.*?)\?table=(.*)&view=(.*)/)
        log.info('larkConfig:', larkConfig || '不是飞书多维表格链接')
        if (vikaConfigWithSpaceId && vikaConfigWithSpaceId.length === 4) {
          config.url = text
          config.spaceId = vikaConfigWithSpaceId[3]
          config.table = vikaConfigWithSpaceId[1]
          config.view = vikaConfigWithSpaceId[2]
        } else if (vikaConfigNoSpaceId && vikaConfigNoSpaceId.length === 3) {
          config.url = text
          config.table = vikaConfigNoSpaceId[1]
          config.view = vikaConfigNoSpaceId[2]

        } else if (larkConfig && larkConfig.length === 4) {
          config.url = text
          config.spaceId = larkConfig[1]
          config.table = larkConfig[2]
          config.view = larkConfig[3]
        }

        logger.info('多维表格配置信息：' + JSON.stringify(config))
        log.info('多维表格配置信息：', JSON.stringify(config))
        if (config.table && config.view) {
          log.info('多维表格配置信息匹配，开始处理...')
          // 处理多维表格配置信息
          // 检查config.talbe是否是ChatFlowConfig.db.dataBaseIds中某个key的value，如果存在则查询ChatFlowConfig.db.dataBaseNames找出对应的表名称
          const tableId = config.table
          const tableCode = ChatFlowConfig.db.dataBaseIdsMap[tableId]
          log.info('数据表标识：', tableCode)
          if (tableCode) {
            const tableName = ChatFlowConfig.db.dataBaseNames[tableCode as keyof typeof ChatFlowConfig.db.dataBaseNames]
            log.info('数据表名称：', tableName)
            await message.say(`检测到多维表格链接，表格名称：【${tableName}】，\n是否需要处理？\n配置信息:\n${JSON.stringify(config, null, 2)}`)
          } else {
            log.info('多维表格配置信息不匹配，不处理...')
            await message.say(`检测到多维表格链接，但不是当前系统的多维表格链接，不处理~\n配置信息:\n${JSON.stringify(config, null, 2)}`)
          }

        } else {
          log.info('多维表格配置信息不全，不处理...')
          await message.say('检测到多维表格链接，但配置信息不全，不处理~')
        }
      }
    } catch (e) {
      log.error('处理多维表格配置信息失败：', e)
    }
  }

  // 群消息处理
  if (room && room.id) {
    await handleAdminRoomSetting(message)
  }

}
