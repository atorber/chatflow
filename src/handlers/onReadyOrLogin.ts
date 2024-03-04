// 不同的puppet对onReady和onLogin的实现可能不一致，需要分别处理

import { Contact, Wechaty, log, Message, Room, Sayable } from 'wechaty'
import { delay, logger } from '../utils/utils.js'
import { ChatFlowConfig } from '../api/base-config.js'
import {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  RoomChat,
  ContactChat,
  ActivityChat,
  NoticeChat,
  QaChat,
  KeywordChat,
} from '../services/mod.js'
import { logForm } from '../utils/mod.js'
import {
  getRoom,
} from '../plugins/mod.js'
import type { WhiteList } from '../services/mod.js'
import type { BusinessRoom, BusinessUser } from '../api/contact-room-finder.js'
import { onMessage } from './on-message.js'

import {
  ServeGetUserConfigGroup,
  ServeGetUserConfig,
  ServeUpdateConfig,
} from '../api/user.js'
import { ServeGetWhitelistWhite } from '../api/white-list.js'
import { ServeGetNotices } from '../api/notice.js'
import { ServeGetKeywords } from '../api/keyword.js'

export const handleSay = async (talker: Room | Contact | Message, sayable: Sayable) => {
  const message: Message | void = await talker.say(sayable)
  if (message) await onMessage(message)
}

async function getWhiteList () {
  const listRes = await ServeGetWhitelistWhite()
  const whiteList: WhiteList = { contactWhiteList: { qa: [], msg: [], act: [], gpt: [] }, roomWhiteList: { qa: [], msg: [], act: [], gpt: [] } }
  const whiteListRecords: any[] = listRes.data.list
  await delay(1000)
  for (let i = 0; i < whiteListRecords.length; i++) {
    const fields = whiteListRecords[i]
    const app: 'qa' | 'msg' | 'act' | 'gpt' = fields['app']?.split('|')[1]
    // logger.info('当前app:' + app)
    if (fields['name'] || fields['id'] || fields['alias']) {
      if (fields['type'] === '群') {
        const room: BusinessRoom = {
          topic: fields['name'],
          id: fields['id'],
        }
        whiteList.roomWhiteList[app].push(room)

      } else {
        const contact: BusinessUser = {
          name: fields['name'],
          alias: fields['alias'],
          id: fields['id'],
        }
        whiteList.contactWhiteList[app].push(contact)
      }
    }
  }

  log.info('获取的最新白名单:' + JSON.stringify(whiteList))
  return whiteList
}

async function getSystemKeywordsText () {
  // const records = await this.getKeywords()
  const res = await ServeGetKeywords()
  const records = res.data.list
  let text :string = '【操作说明】\n'
  for (const fields of records) {
    if (fields['type'] === '系统指令') text += `${fields['name']} : ${fields['desc']}\n`
  }
  return text
}

const notifyAdminRoom = async (bot: Wechaty) => {
  // log.info('notifyAdminRoom,初始化vika配置信息', bot)

  if (ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID || ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC) {
    const adminRoom = await getRoom(bot, { topic: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC, id: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID })

    const helpText = await getSystemKeywordsText()
    const text = `${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可在管理员群回复对应指令进行操作\n${helpText}\n`
    if (adminRoom) await handleSay(adminRoom, text)
    // await adminRoom?.say(text)
  }
}

const postVikaInitialization = async (bot: Wechaty) => {
  // log.info('初始化vika配置信息：', bot)

  try {
    log.info('开始请求维格表中的环境变量配置信息...')
    // const vikaConfig = await EnvChat.getConfigFromVika()

    // 从维格表中获取环境变量配置
    const vikaConfigList = await ServeGetUserConfig() as any
    const vikaConfig:any = {}
    for (let i = 0; i < vikaConfigList.length; i++) {
      const record:any = vikaConfigList[i]
      const fields = record.fields

      if (fields['key']) {
        if (fields['value'] && [ 'false', 'true' ].includes(fields['value'])) {
          vikaConfig[record.fields['key'] as string] = fields['value'] === 'true'
        } else {
          vikaConfig[record.fields['key'] as string] = fields['value'] || ''
        }
      }
    }
    // 合并配置信息，如果维格表中有对应配置则覆盖环境变量中的配置
    ChatFlowConfig.configEnv = { ...vikaConfig, ...(ChatFlowConfig.configEnv) }
    logger.info('合并后的环境变量信息：' + JSON.stringify(ChatFlowConfig.configEnv))

    try {
      log.info('开始请求获取白名单...')
      // 获取白名单列表
      // ChatFlowConfig.whiteList = await WhiteListChat.getWhiteList()
      ChatFlowConfig.whiteList = await getWhiteList()
      log.info('获取白名单成功...', JSON.stringify(ChatFlowConfig.whiteList))

      try {
        // 获取定时任务列表
        const jobsRes = await ServeGetNotices()
        const jobs = jobsRes.data.list
        // 更新定时任务
        await NoticeChat.updateJobs(jobs)

        // 获取关键字列表
        const helpText = await getSystemKeywordsText()
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

  } catch (err) {
    log.error('向管理群推送消息失败...', err)
  }
}

const initializeServicesAndEnv = async () => {
  logger.info('初始化服务开始...')

  // 环境变量配置
  await EnvChat.init()
  await delay(500)

  // 消息上传
  await MessageChat.init()
  await delay(500)

  // 活动消息
  await ActivityChat.init()
  await delay(500)

  // 联系人消息
  await ContactChat.init()
  await delay(500)

  // 群通知
  await GroupNoticeChat.init()
  await delay(500)

  // 关键字服务
  await KeywordChat.init()
  await delay(500)

  // 定时任务
  await NoticeChat.init()
  await delay(500)

  // 群聊
  await RoomChat.init()
  await delay(500)

  // 白名单
  await WhiteListChat.init()
  await delay(500)

  // 问答
  await QaChat.init()
  // logger.info('services:' + JSON.stringify(services))

  log.info('初始化服务完成...')
}

export const onReadyOrLogin = async (bot: Wechaty) => {
  log.info('onReadyOrLogin,初始化services服务...')
  const curTime = new Date().getTime()
  const user: Contact = bot.currentUser
  log.info('当前登录的账号信息:', user.name())

  // 初始化服务
  await initializeServicesAndEnv()
  await delay(500)

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

  log.info('获取的基础配置信息:', JSON.stringify(baseConfig))

  // 从baseConfig中找出key为BASE_BOT_ID的配置项，更新value为当前登录的bot的id
  const BASE_BOT_ID = baseConfig.find((item) => item.key === 'BASE_BOT_ID')

  if (BASE_BOT_ID) {
    BASE_BOT_ID.value = user.id
    BASE_BOT_ID.lastOperationTime = curTime
    BASE_BOT_ID.syncStatus = '已同步'
    baseInfo.push(BASE_BOT_ID)
  }

  const BASE_BOT_NAME = baseConfig.find((item) => item.key === 'BASE_BOT_NAME')
  if (BASE_BOT_NAME) {
    BASE_BOT_NAME.value = user.name()
    BASE_BOT_NAME.lastOperationTime = curTime
    BASE_BOT_NAME.syncStatus = '已同步'
    baseInfo.push(BASE_BOT_NAME)
  }

  const ADMINROOM_ADMINROOMTOPIC = baseConfig.find((item) => item.key === 'ADMINROOM_ADMINROOMTOPIC')
  if (ADMINROOM_ADMINROOMTOPIC) {
    ADMINROOM_ADMINROOMTOPIC.value = ChatFlowConfig.adminRoomTopic || process.env.ADMINROOM_ADMINROOMTOPIC || ''
    ADMINROOM_ADMINROOMTOPIC.lastOperationTime = curTime
    ADMINROOM_ADMINROOMTOPIC.syncStatus = '已同步'
    baseInfo.push(ADMINROOM_ADMINROOMTOPIC)
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
    log.info('更新基础配置信息:', JSON.stringify(baseInfo))
    await ServeUpdateConfig(baseInfo)
    await delay(500)
  }

  try {
    log.info('调用postVikaInitialization...')
    // 初始化vika配置信息
    await postVikaInitialization(bot)
  } catch (err) {
    log.error('postVikaInitialization(bot) error', err)
  }
}
