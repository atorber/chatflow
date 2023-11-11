// 不同的puppet对onReady和onLogin的实现可能不一致，需要分别处理

import { Contact, Wechaty, log, Message, Room, Sayable } from 'wechaty'
import { delay, logger } from '../utils/utils.js'
import { ChatFlowConfig } from '../api/base-config.js'
import { initializeServicesAndEnv } from '../proxy/initializeServicesAndEnv.js'
import {
  EnvChat,
  KeywordChat,
  WhiteListChat,
  NoticeChat,
} from '../services/mod.js'
import { logForm } from '../utils/mod.js'
import {
  getRoom,
} from '../plugins/mod.js'

import { onMessage } from './on-message.js'

export const handleSay = async (talker: Room | Contact | Message, sayable: Sayable) => {
  const message: Message | void = await talker.say(sayable)
  if (message) await onMessage(message)
}

const notifyAdminRoom = async (bot: Wechaty) => {
  // log.info('notifyAdminRoom,初始化vika配置信息', bot)

  if (ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID || ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC) {
    const adminRoom = await getRoom(bot, { topic: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC, id: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID })
    const helpText = await KeywordChat.getSystemKeywordsText()
    const text = `${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可在管理员群回复对应指令进行操作\n${helpText}\n`
    if (adminRoom) await handleSay(adminRoom, text)
    // await adminRoom?.say(text)
  }
}

const postVikaInitialization = async (bot: Wechaty) => {
  // log.info('初始化vika配置信息：', bot)

  try {
    log.info('开始请求维格表中的环境变量配置信息...')
    const vikaConfig = await EnvChat.getConfigFromVika()

    // 合并配置信息，如果维格表中有对应配置则覆盖环境变量中的配置
    ChatFlowConfig.configEnv = { ...vikaConfig, ...(ChatFlowConfig.configEnv) }
    logger.info('合并后的环境变量信息：' + JSON.stringify(ChatFlowConfig.configEnv))

    try {
      log.info('开始请求获取白名单...')
      ChatFlowConfig.whiteList = await WhiteListChat.getWhiteList()
      // await (chatflowConfig.services as Services).roomService.updateRooms(bot, configEnv.WECHATY_PUPPET)
      // await (chatflowConfig.services as Services).contactService.updateContacts(bot, configEnv.WECHATY_PUPPET)

      // 每30s上报一次心跳
      // setInterval(() => {
      //   const curDate = new Date().toLocaleString()
      //   logger.info('当前时间:' + curDate)
      //   try {
      //     if (mqttProxy.isOk && configEnv.MQTT_MQTTMESSAGEPUSH) {
      //       mqttProxy.pubProperty(propertyMessage('lastActive', curDate))
      //     }
      //   } catch (err) {
      //     logger.error('发送心跳失败:', err)
      //   }
      // }, 300000)

      try {
        await NoticeChat.updateJobs()
        const helpText = await KeywordChat.getSystemKeywordsText()
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
    await notifyAdminRoom(bot)
    log.info('向管理群推送消息成功...')

  } catch (err) {
    log.error('向管理群推送消息失败...', err)
  }
}

export const onReadyOrLogin = async (bot: Wechaty) => {
  log.info('初始化services服务...')
  await initializeServicesAndEnv()
  await delay(500)
  const res = await EnvChat.findByField('key', 'BASE_BOT_ID')
  // log.info('当前云端配置的BASE_BOT_ID:', JSON.stringify(res))
  const BASE_BOT_ID:any = res[0]
  await delay(500)
  BASE_BOT_ID.fields.value = bot.currentUser.id
  BASE_BOT_ID.fields.lastOperationTime = new Date().getTime()
  BASE_BOT_ID.fields.syncStatus = '已同步'

  await EnvChat.update(BASE_BOT_ID.recordId, BASE_BOT_ID.fields)

  const user: Contact = bot.currentUser
  log.info('当前登录的账号信息:', user.name())

  try {
    log.info('调用postVikaInitialization...')
    await postVikaInitialization(bot)
  } catch (err) {
    log.error('postVikaInitialization(bot) error', err)
  }
}
