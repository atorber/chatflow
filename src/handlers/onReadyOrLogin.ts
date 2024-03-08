// 不同的puppet对onReady和onLogin的实现可能不一致，需要分别处理

import { Contact, Wechaty, log, Message, Room, Sayable } from 'wechaty'
import { delay, logger } from '../utils/utils.js'
import { ChatFlowConfig } from '../api/base-config.js'
import {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  ActivityChat,
  NoticeChat,
  QaChat,
} from '../services/mod.js'
import { logForm } from '../utils/mod.js'
import {
  getRoom,
} from '../plugins/mod.js'
import { onMessage } from './on-message.js'

import {
  ServeGetUserConfigGroup,
  ServeUpdateConfig,
} from '../api/user.js'
import {
  ServeGetWhitelistWhiteObject,
} from '../api/white-list.js'
import { ServeGetChatbotUsersDetail } from '../api/chatbot.js'
import { ServeGetWelcomes } from '../api/welcome.js'

export const handleSay = async (talker: Room | Contact | Message, sayable: Sayable) => {
  const message: Message | void = await talker.say(sayable)
  if (message) await onMessage(message)
}

// 处理管理员群消息
const notifyAdminRoom = async (bot: Wechaty) => {
  // log.info('notifyAdminRoom,初始化vika配置信息', bot)

  if (ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID || ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC) {
    const adminRoom = await getRoom(bot, { topic: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC, id: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID })

    const helpText = await ChatFlowConfig.getSystemKeywordsText()
    const text = `${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可在管理员群回复对应指令进行操作\n${helpText}\n`
    if (adminRoom) await handleSay(adminRoom, text)
    // await adminRoom?.say(text)
  }
}

// 从云端加载配置信息
const postVikaInitialization = async (bot: Wechaty) => {
  // log.info('初始化vika配置信息：', bot)

  try {
    log.info('开始请求维格表中的环境变量配置信息...')
    const res = await EnvChat.getConfigFromVika()
    logger.info('ServeGetUserConfig res:' + JSON.stringify(res))

    const vikaConfig:any = res.data
    // logger.info('获取的维格表中的环境变量配置信息vikaConfig：' + JSON.stringify(vikaConfig))

    // 合并配置信息，如果维格表中有对应配置则覆盖环境变量中的配置
    ChatFlowConfig.configEnv = { ...vikaConfig, ...(ChatFlowConfig.configEnv) }
    logger.info('合并后的环境变量信息：' + JSON.stringify(ChatFlowConfig.configEnv))

    // 下载进群欢迎语
    try {
      const welcomes = await ServeGetWelcomes()
      ChatFlowConfig.welcomeList = welcomes.data.items
      logger.info('获取的进群欢迎语：' + JSON.stringify(ChatFlowConfig.welcomeList))
    } catch (err) {
      log.error('获取进群欢迎语失败', err)
    }

    try {
      log.info('开始请求获取白名单...')
      // 获取白名单列表
      const listRes = await ServeGetWhitelistWhiteObject()
      ChatFlowConfig.whiteList = listRes.data
      logger.info('获取白名单成功...' + JSON.stringify(ChatFlowConfig.whiteList))

      try {
        // 更新定时任务
        await NoticeChat.updateJobs()
        // 获取关键字列表
        const helpText = await ChatFlowConfig.getSystemKeywordsText()
        logForm(`启动成功，系统准备就绪\n\n当前登录用户：${bot.currentUser.name()}\nID:${bot.currentUser.id}\n\n在当前群（管理员群）回复对应指令进行操作\n${helpText}`)
      } catch (err) {
        log.error('获取帮助文案失败', err)
      }
    } catch (err) {
      log.error('获取白名单失败', err)
    }

  } catch (err) {
    log.error('初始化配置信息失败：', err)
  }

  try {
    // 向管理员群推送消息
    await notifyAdminRoom(bot)
    log.info('向管理群推送消息成功...')
    const ChatFlowConfigInfo = {
      configEnv: ChatFlowConfig.configEnv,
      whiteList: ChatFlowConfig.whiteList,
      chatBotUsers: ChatFlowConfig.chatBotUsers,
    }
    logger.info('ChatFlowConfigInfo配置信息：' + JSON.stringify(ChatFlowConfigInfo))
  } catch (err) {
    log.error('向管理群推送消息失败...', err)
  }
}

// bot就绪或登录事件操作
export const onReadyOrLogin = async (bot: Wechaty) => {
  const curTime = new Date().getTime()
  const user: Contact = bot.currentUser
  log.info('当前登录的账号信息:', user.name())

  // 初始化服务
  try {
    log.info('onReadyOrLogin,初始化services服务...')
    logger.info('初始化服务开始...')

    // 消息上传服务初始化
    await MessageChat.init()
    await delay(500)

    // 活动管理服务初始化
    await ActivityChat.init()
    await delay(500)

    // 群通知管理服务初始化
    await GroupNoticeChat.init()
    await delay(500)

    // 定时任务服务初始化
    await NoticeChat.init()
    await delay(500)

    // 白名单服务初始化
    await WhiteListChat.init()
    await delay(500)

    // 智能问答服务初始化
    await QaChat.init()
    // logger.info('services:' + JSON.stringify(services))
    ChatFlowConfig.isReady = true
    log.info('初始化服务完成...')
    await delay(500)
  } catch (err) {
    log.error('初始化服务失败', err)
  }

  // 更新当前登录的bot信息到云端
  let baseInfo = []
  const resConfig:any = await ServeGetUserConfigGroup()
  const configGgroup = resConfig.data
  const baseConfig:{
    id?:string;
    name:string;
    value:any;
    key:string;
    lastOperationTime:number;
    syncStatus:string;
  }[] = configGgroup['基础配置']

  logger.info('获取的基础配置信息:' + JSON.stringify(baseConfig))

  // 从baseConfig中找出key为BASE_BOT_ID的配置项，更新value为当前登录的bot的id
  const BASE_BOT_ID = baseConfig.find((item) => item.key === 'BASE_BOT_ID')

  if (BASE_BOT_ID) {
    BASE_BOT_ID.name = `基础配置-${BASE_BOT_ID.name}`
    BASE_BOT_ID.value = user.id
    BASE_BOT_ID.lastOperationTime = curTime
    BASE_BOT_ID.syncStatus = '已同步'
    baseInfo.push(BASE_BOT_ID)
  }

  const BASE_BOT_NAME = baseConfig.find((item) => item.key === 'BASE_BOT_NAME')
  if (BASE_BOT_NAME) {
    BASE_BOT_NAME.name = `基础配置-${BASE_BOT_NAME.name}`
    BASE_BOT_NAME.value = user.name()
    BASE_BOT_NAME.lastOperationTime = curTime
    BASE_BOT_NAME.syncStatus = '已同步'
    baseInfo.push(BASE_BOT_NAME)
  }

  const ADMINROOM_ADMINROOMTOPIC = baseConfig.find((item) => item.key === 'ADMINROOM_ADMINROOMTOPIC')
  const topic = ChatFlowConfig.adminRoomTopic || process.env.ADMINROOM_ADMINROOMTOPIC || ''
  if (ADMINROOM_ADMINROOMTOPIC && topic) {
    ADMINROOM_ADMINROOMTOPIC.name = `基础配置-${ADMINROOM_ADMINROOMTOPIC.name}`
    ADMINROOM_ADMINROOMTOPIC.value = topic
    ADMINROOM_ADMINROOMTOPIC.lastOperationTime = curTime
    ADMINROOM_ADMINROOMTOPIC.syncStatus = '已同步'
    baseInfo.push(ADMINROOM_ADMINROOMTOPIC)

    const adminRoom = await bot.Room.find({ topic })
    if (adminRoom) {
      const ADMINROOM_ADMINROOMID = baseConfig.find((item) => item.key === 'ADMINROOM_ADMINROOMID')
      if (ADMINROOM_ADMINROOMID) {
        ADMINROOM_ADMINROOMID.name = `基础配置-${ADMINROOM_ADMINROOMID.name}`
        ADMINROOM_ADMINROOMID.value = adminRoom.id
        ADMINROOM_ADMINROOMID.lastOperationTime = curTime
        ADMINROOM_ADMINROOMID.syncStatus = '已同步'
        baseInfo.push(ADMINROOM_ADMINROOMID)
      }
    }
  }

  if (baseInfo.length > 0) {
    baseInfo = baseInfo.map((item) => {
      const raw:any = {
        recordId:'',
        fields: {},
      }
      raw.recordId = item.id
      delete item.id
      raw.fields = item
      return raw
    })
    logger.info('更新基础配置信息:' + JSON.stringify(baseInfo))
    await ServeUpdateConfig(baseInfo)
    await delay(500)
  }

  try {
    const chatBotUsers = await ServeGetChatbotUsersDetail()
    ChatFlowConfig.chatBotUsers = chatBotUsers.data.items
    logger.info('获取chatBotUsers:' + JSON.stringify(ChatFlowConfig.chatBotUsers))
  } catch (err) {
    log.error('获取chatBotUsers失败', err)
  }

  try {
    log.info('调用postVikaInitialization...')
    // 初始化vika配置信息
    await postVikaInitialization(bot)
  } catch (err) {
    log.error('postVikaInitialization(bot) error', err)
  }
}
