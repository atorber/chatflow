// 不同的puppet对onReady和onLogin的实现可能不一致，需要分别处理

import { Contact, Wechaty, log, Message, Room, Sayable } from 'wechaty'
import { delay, logger } from '../utils/utils.js'
import { ChatFlowConfig } from '../db/vika-bot.js'
import { initializeServicesAndEnv } from '../proxy/initializeServicesAndEnv.js'
import {
  EnvChat,
  Services,
} from '../services/mod.js'
import { logForm } from '../utils/mod.js'
import CryptoJS from 'crypto-js'
import {
  getRoom,
} from '../plugins/mod.js'

import {
  MqttProxy,
  IClientOptions,
} from '../plugins/mqtt-proxy.js'

import { onMessage } from './on-message.js'

export const handleSay = async (talker: Room | Contact | Message, sayable: Sayable) => {
  const message: Message | void = await talker.say(sayable)
  if (message) await onMessage(message)
}

const initializeMQTT = (bot: Wechaty) => {
  // 计算clientid原始字符串
  const clientString = ChatFlowConfig.configEnv.VIKA_TOKEN + ChatFlowConfig.configEnv.VIKA_SPACE_NAME
  // clientid加密
  const client = CryptoJS.SHA256(clientString).toString()

  // 初始化mqtt
  const config:IClientOptions = {
    username: ChatFlowConfig.configEnv.MQTT_USERNAME,
    password: ChatFlowConfig.configEnv.MQTT_PASSWORD,
    host: ChatFlowConfig.configEnv.MQTT_ENDPOINT,
    port: Number(ChatFlowConfig.configEnv.MQTT_PORT),
    clientId: ChatFlowConfig.configEnv.BASE_BOT_ID || client,
    clean: false,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    keepalive: 60,
    resubscribe: true,
    protocolId: 'MQTT',
    protocolVersion: 4,
    rejectUnauthorized: false,
  }

  const mqttProxy = MqttProxy.getInstance(config)
  mqttProxy.setWechaty(bot)
  return mqttProxy
}

const notifyAdminRoom = async (bot: Wechaty) => {
  log.info('notifyAdminRoom,初始化vika配置信息', bot)

  if (ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID || ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC) {
    const adminRoom = await getRoom(bot, { topic: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMTOPIC, id: ChatFlowConfig.configEnv.ADMINROOM_ADMINROOMID })
    const helpText = await (ChatFlowConfig.services as Services).keywordService.getSystemKeywordsText()
    const text = `${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可在管理员群回复对应指令进行操作\n${helpText}\n`
    if (adminRoom) await handleSay(adminRoom, text)
    // await adminRoom?.say(text)
  }
}

const postVikaInitialization = async (bot: Wechaty) => {
  log.info('postVikaInitialization,初始化vika配置信息', bot)

  try {
    log.info('开始请求维格表中的环境变量配置信息...')
    await ChatFlowConfig.envService.init()
    const vikaConfig = await ChatFlowConfig.envService.getConfigFromVika()
    log.info('维格表中的环境变量配置信息：', JSON.stringify(vikaConfig))
    log.info('环境变量中的环境变量配置信息：', JSON.stringify(ChatFlowConfig.configEnv))

    ChatFlowConfig.configEnv = { ...(ChatFlowConfig.configEnv), ...vikaConfig }
    logger.info('合并后的环境变量信息：' + JSON.stringify(ChatFlowConfig.configEnv))

    try {
      log.info('开始请求获取白名单...')
      ChatFlowConfig.whiteList = await (ChatFlowConfig.services as Services).whiteListService.getWhiteList()
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
        await (ChatFlowConfig.services as Services).noticeService.updateJobs(bot, (ChatFlowConfig.services as Services).messageService)
        const helpText = await (ChatFlowConfig.services as Services).keywordService.getSystemKeywordsText()
        logForm(`启动成功，系统准备就绪，在当前群（管理员群）回复对应指令进行操作\n\n${helpText}`)
      } catch (err) {
        log.error('获取帮助文案失败', err)
      }
    } catch (err) {
      log.error('获取白名单失败', err)
    }

  } catch (err) {
    log.error('postVikaInitialization error', err)
  }

  try {
    await notifyAdminRoom(bot)
    log.info('notifyAdminRoom success')

  } catch (err) {
    log.error('notifyAdminRoom error', err)
  }
}

const shouldInitializeMQTT = () => {
  log.info('检查MQTT信息...')
  return ChatFlowConfig.configEnv.MQTT_ENDPOINT && (ChatFlowConfig.configEnv.MQTT_MQTTCONTROL || ChatFlowConfig.configEnv.MQTT_MQTTMESSAGEPUSH)
}

export const onReadyOrLogin = async (bot: Wechaty) => {
  if (!ChatFlowConfig.services) {
    log.info('初始化services服务,initializeServicesAndEnv()')
    await initializeServicesAndEnv()
    await delay(500)
    const res = await EnvChat.findByField('key', 'BASE_BOT_ID')
    log.info('当前云端配置的BASE_BOT_ID:', JSON.stringify(res))
    const BASE_BOT_ID:any = res[0]
    await delay(500)
    BASE_BOT_ID.fields.value = bot.currentUser.id
    BASE_BOT_ID.fields.lastOperationTime = new Date().getTime()
    BASE_BOT_ID.fields.syncStatus = '已同步'

    await EnvChat.update(BASE_BOT_ID.recordId, BASE_BOT_ID.fields)
  }

  const user: Contact = bot.currentUser
  log.info('当前登录的账号信息:', user.name())

  try {
    log.info('调用postVikaInitialization...')
    await postVikaInitialization(bot)
  } catch (err) {
    log.error('postVikaInitialization(bot) error', err)
  }

  try {
    if (shouldInitializeMQTT()) {
      log.info('MQTT服务功能开启，初始化MQTT服务...')
      initializeMQTT(bot)
    } else {
      log.info('MQTT服务功能未开启...')
    }
  } catch (err) {
    log.error('initializeMQTT error', err)
  }
}
