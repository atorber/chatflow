// 不同的puppet对onReady和onLogin的实现可能不一致，需要分别处理

import { Contact, Wechaty, log } from 'wechaty'
import { delay } from '../utils/utils.js'
import { ChatFlowCore } from '../api/base-config.js'
import {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  ActivityChat,
  NoticeChat,
  QaChat,
} from '../services/mod.js'
import {
  getRoom,
} from '../plugins/mod.js'

import {
  ServeGetUserConfigGroup,
  ServeUpdateConfig,
} from '../api/user.js'
import {
  ServeGetWhitelistWhiteObject,
} from '../api/white-list.js'
import { ServeGetChatbotUsersDetail } from '../api/chatbot.js'
import { ServeGetWelcomes } from '../api/welcome.js'
import { sendMsg } from '../services/configService.js'

import getAuthClient from '../utils/auth.js'
import * as fs from 'fs'
import { join } from 'path'
import type { ChatFlowOptions, CloudConfig } from '../types/interface.js'
import { MqttProxy } from '../proxy/mqtt-proxy.js'

const initServer = async (options: ChatFlowOptions) => {
  // log.info('初始化ChatFlowCore...', JSON.stringify(options))
  // 获取根目录
  const rootDir =  options.dataDir || process.cwd()
  log.info('rootDir', rootDir)
  ChatFlowCore.setOptions(options)
  const authClient = getAuthClient({
    password: options.token,
    username: options.spaceId,
    endpoint: options.endpoint || '',
  })
  // 检测./data文件夹，如果不存在则创建
  // 在程序安装目录下创建/data目录，用于存放配置文件、日志文件、数据库文件、媒体文件等
  if (!fs.existsSync(join(rootDir, 'data'))) {
    fs.mkdirSync(join(rootDir, 'data'))
  }

  if (!fs.existsSync(join(rootDir, 'data/table'))) {
    fs.mkdirSync(join(rootDir, 'data/table'))
  }
  if (!fs.existsSync(join(rootDir, 'data/logs'))) {
    fs.mkdirSync(join(rootDir, 'data/logs'))
  }
  if (!fs.existsSync(join(rootDir, 'data/db'))) {
    fs.mkdirSync(join(rootDir, 'data/db'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media'))) {
    fs.mkdirSync(join(rootDir, 'data/media'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image/room'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image/room'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image/contact'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image/contact'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image/qrcode'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image/qrcode'))
  }

  // 远程加载配置信息，初始化api客户端
  try {
    try {
      // 初始化检查数据库表，如果不存在则创建
      const initRes = await authClient?.init(options.spaceId, options.token)
      log.info('初始化检查系统表结果：' + JSON.stringify(initRes.data))

      if (initRes.data && initRes.data.message === 'success') {
        log.info('初始化检查系统表成功...')
        ChatFlowCore.db = initRes.data.data
      } else {
        log.info('初始化检查系统表失败...' + JSON.stringify(initRes.data))
        // 中止程序
        throw new Error(initRes)
      }
    } catch (e) {
      log.error('请求初始化检查系统表失败...', e)
      throw e
    }
    await delay(1000)
    try {
      const loginRes = await authClient?.login(options.spaceId, options.token)
      log.info('登录客户端结果：' + JSON.stringify(loginRes))
      ChatFlowCore.isLogin = true
    } catch (e) {
      log.error('登录客户端失败...', e)
      throw e
    }
  } catch (e) {
    log.error('登录客户端失败...', e)
  }

  // 从配置文件中读取配置信息，包括wechaty配置、mqtt配置以及是否启用mqtt推送或控制
  try {
    const configAll = await ChatFlowCore.init(options)
    // log.info('configAll', JSON.stringify(configAll))

    const config: CloudConfig | undefined = configAll // 默认使用vika，使用lark时，需要传入'lark'参数await ChatFlowCore.init('lark')
    // log.info('config', JSON.stringify(config, undefined, 2))

    // 构建机器人
    // 如果MQTT推送或MQTT控制打开，则启动MQTT代理
    if (config.mqttIsOn) {
      log.info('启动MQTT代理...', JSON.stringify(config.mqttConfig))
      try {
        const mqttProxy = MqttProxy.getInstance(config.mqttConfig)
        if (mqttProxy && ChatFlowCore.bot.currentUser.id === '1') {
          mqttProxy.setWechaty(ChatFlowCore.bot)
        }
      } catch (e) {
        log.error('MQTT代理启动失败，检查mqtt配置信息是否正确...', e)
      }
    }
    return config
  } catch (e) {
    log.error('初始化ChatFlowCore失败...', e)
    throw e
    // return undefined
  }

}

// 处理管理员群消息
const notifyAdminRoom = async (bot: Wechaty) => {
  // log.info('notifyAdminRoom,初始化vika配置信息', bot)

  if (ChatFlowCore.configEnv.ADMINROOM_ADMINROOMID || ChatFlowCore.configEnv.ADMINROOM_ADMINROOMTOPIC) {
    const adminRoom = await getRoom(bot, { topic: ChatFlowCore.configEnv.ADMINROOM_ADMINROOMTOPIC, id: ChatFlowCore.configEnv.ADMINROOM_ADMINROOMID })
    const helpText = await ChatFlowCore.getSystemKeywordsText()
    const text = `${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可在管理员群回复对应指令进行操作\n${helpText}\n`
    if (adminRoom) {
      ChatFlowCore.adminRoom = adminRoom
      await sendMsg(adminRoom, text)
    }
  }
}

// 从云端加载配置信息
const postVikaInitialization = async (bot: Wechaty) => {
  // log.info('初始化vika配置信息：', bot)

  try {
    log.info('开始请求维格表中的环境变量配置信息...')
    const res = await EnvChat.getConfigFromVika()
    ChatFlowCore.logger.info('ServeGetUserConfig res:' + JSON.stringify(res))

    const vikaConfig:any = res.data
    // ChatFlowCore.logger.info('获取的维格表中的环境变量配置信息vikaConfig：' + JSON.stringify(vikaConfig))

    // 合并配置信息，如果维格表中有对应配置则覆盖环境变量中的配置
    ChatFlowCore.configEnv = { ...vikaConfig, ...(ChatFlowCore.configEnv) }
    ChatFlowCore.logger.info('合并后的环境变量信息：' + JSON.stringify(ChatFlowCore.configEnv))

    // 下载进群欢迎语
    try {
      const welcomes = await ServeGetWelcomes()
      ChatFlowCore.welcomeList = welcomes.data.items
      ChatFlowCore.logger.info('获取的进群欢迎语：' + JSON.stringify(ChatFlowCore.welcomeList))
    } catch (err) {
      log.error('获取进群欢迎语失败', err)
    }

    try {
      log.info('开始请求获取白名单...')
      // 获取白名单列表
      const listRes = await ServeGetWhitelistWhiteObject()
      ChatFlowCore.whiteList = listRes.data
      ChatFlowCore.logger.info('获取白名单成功...' + JSON.stringify(ChatFlowCore.whiteList))

      try {
        // 更新定时任务
        await NoticeChat.updateJobs()
        // 获取关键字列表
        const helpText = await ChatFlowCore.getSystemKeywordsText()
        log.info(`启动成功，系统准备就绪\n\n当前登录用户：${bot.currentUser.name()}\nID:${bot.currentUser.id}\n\n在当前群（管理员群）回复对应指令进行操作\n${helpText}`)
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
    const ChatFlowCoreInfo = {
      configEnv: ChatFlowCore.configEnv,
      whiteList: ChatFlowCore.whiteList,
      chatBotUsers: ChatFlowCore.chatBotUsers,
    }
    ChatFlowCore.logger.info('ChatFlowCoreInfo配置信息：' + JSON.stringify(ChatFlowCoreInfo))
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

    let config: CloudConfig | undefined
    // 初始化检查数据库表，如果不存在则创建
    try {
      config = await initServer(ChatFlowCore.chatFlowConfig)
      log.info('初始化检查成功：', JSON.stringify(config))
    } catch (e) {
      log.info('初始化检查失败：' + JSON.stringify(e))
      throw e
    }

    log.info('onReadyOrLogin,初始化services服务...')
    ChatFlowCore.logger.info('初始化服务开始...')

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
    // ChatFlowCore.logger.info('services:' + JSON.stringify(services))
    ChatFlowCore.isReady = true
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

  ChatFlowCore.logger.info('获取的基础配置信息:' + JSON.stringify(baseConfig))

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
  const topic = ChatFlowCore.adminRoomTopic || ''
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

  // const wechatyConfig:{
  //   id?:string;
  //   name:string;
  //   value:any;
  //   key:string;
  //   lastOperationTime:number;
  //   syncStatus:string;
  // }[] = configGgroup['Wechaty']

  // const WECHATY_PUPPET = wechatyConfig.find((item) => item.key === 'WECHATY_PUPPET')
  // if (WECHATY_PUPPET) {
  //   WECHATY_PUPPET.name = `Wechaty-${WECHATY_PUPPET.name}`
  //   WECHATY_PUPPET.value = bot.puppet.name()
  //   WECHATY_PUPPET.lastOperationTime = curTime
  //   WECHATY_PUPPET.syncStatus = '已同步'
  //   baseInfo.push(WECHATY_PUPPET)
  // }

  // const WECHATY_TOKEN = wechatyConfig.find((item) => item.key === 'WECHATY_TOKEN')
  // if (WECHATY_TOKEN) {
  //   WECHATY_TOKEN.name = `Wechaty-${WECHATY_TOKEN.name}`
  //   WECHATY_TOKEN.value = ''
  //   WECHATY_TOKEN.lastOperationTime = curTime
  //   WECHATY_TOKEN.syncStatus = '已同步'
  //   baseInfo.push(WECHATY_TOKEN)
  // }

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
    ChatFlowCore.logger.info('更新基础配置信息:' + JSON.stringify(baseInfo))
    await ServeUpdateConfig(baseInfo)
    await delay(500)
  }

  try {
    const chatBotUsers = await ServeGetChatbotUsersDetail()
    ChatFlowCore.chatBotUsers = chatBotUsers.data.items
    ChatFlowCore.logger.info('获取chatBotUsers:' + JSON.stringify(ChatFlowCore.chatBotUsers))
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
