import { Message, log } from 'wechaty'

import { saveMessage, formatMessage } from '../api/message.js'
import { ChatFlowConfig } from '../api/base-config.js'
import type { ChatMessage } from '../types/mod.js'

import {
  // logger,
  logForm,
} from '../utils/mod.js'

import {
  MessageChat,
} from '../services/mod.js'

import { MqttProxy, eventMessage } from '../proxy/mqtt-proxy.js'

import { adminAction } from '../api/admin.js'
import { qa } from '../app/qa.js'
import { handleActivityManagement } from '../app/activity.js'
import { extractAtContent } from '../app/extract-at.js'

export async function onMessage (message: Message) {

  // 存储消息到db，如果写入失败则终止，用于检测是否是重复消息
  const addRes = await saveMessage(message)
  if (!addRes) return

  const room = message.room()
  const isSelf = message.self()

  const chatMessage: ChatMessage = await MessageChat.formatMessage(message)

  // logger.info('bot onMessage,接收到消息,chatMessage:\n' + JSON.stringify(chatMessage))
  logForm(JSON.stringify(chatMessage))

  // 请求管理员群操作
  try {
    await adminAction(message)
  } catch (e) {
    log.error('管理员操作失败 error:', e)
  }

  // 请求自动问答
  try {
    await qa(message)
  } catch (e) {
    log.error('自动问答失败 error:', e)
  }

  // 群消息处理，判断非机器人自己发的消息
  if (room && room.id && !isSelf) {

    // 活动管理
    await handleActivityManagement(message, room)

    // @机器人消息处理，当引用消息仅包含@机器人时，提取引用消息内容并回复
    await extractAtContent(message)
  }

  // 消息存储到维格表
  if (ChatFlowConfig.configEnv.VIKA_UPLOADMESSAGETOVIKA) {
    // logger.info('消息同步到维格表...')
    await MessageChat.onMessage(message)
  }

  const mqttProxy = MqttProxy.getInstance()

  // 消息通过MQTT上报
  if (mqttProxy && mqttProxy.isOk && ChatFlowConfig.configEnv.MQTT_MQTTMESSAGEPUSH) {
    mqttProxy.pubEvent(eventMessage('onMessage', await formatMessage(message)))
  }

}

export default onMessage
