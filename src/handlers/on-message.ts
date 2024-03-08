import { Message, log } from 'wechaty'
import {
  formatMessageToMQTT,
  formatMessageToDB,
  saveMessageToDB,
  formatMessageToLog,
  formatMessageToCloud,
  saveMessageToCloud,
} from '../api/message.js'
import { ChatFlowConfig } from '../api/base-config.js'
import {
  // logger,
  logForm, logger,
} from '../utils/mod.js'

import { MqttProxy, eventMessage } from '../proxy/mqtt-proxy.js'
import { uploadMessage } from '../proxy/s3-proxy.js'

import { adminAction } from '../api/admin.js'
import { qa } from '../app/qa.js'
import { chatbot } from '../app/chatbot.js'
import { handleActivityManagement } from '../app/activity.js'
import { extractAtContent } from '../app/extract-at.js'
import { ServeGetMedias } from '../api/media.js'
import { ServeCreateCarpoolings } from '../api/carpooling.js'

import { getFormattedRideInfo } from '../plugins/mod.js'

export async function onMessage (message: Message) {
  const text = message.text()
  // 存储消息到db，如果写入失败则终止，用于检测是否是重复消息
  try {
    const messageToDB = await formatMessageToDB(message)
    const addRes = await saveMessageToDB(messageToDB)
    if (!addRes) return
  } catch (e) {
    log.error('消息写入数据库失败:\n', e)
  }

  // 输出格式化消息log
  try {
    const chatMessage = await formatMessageToLog(message)
    logForm(JSON.stringify(chatMessage))
  } catch (e) {
    log.error('消息格式化失败:\n', e)
  }

  if (ChatFlowConfig.isReady) {
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

    // 请求智聊服务
    try {
      log.info('智聊服务开始...')
      await chatbot(message)
    } catch (e) {
      log.error('智聊服务失败 error:', e)
    }

    // 关键字回复
    try {
      if (text && ChatFlowConfig.keywordList.length > 0) {
        log.info('触发关键字回复...')
        const keywordItem = ChatFlowConfig.keywordList.find((item) => item.name === text && item.type === '等于关键字')
        if (keywordItem) {
          await message.say(keywordItem.desc)
        }
      }
    } catch (e) {
      log.error('关键字回复失败 error:', e)
    }

    // 搜资源
    try {
      const ifMedia = text.startsWith('搜资源')
      if (ifMedia) {
        log.info('触发搜资源...')
        // 资源名称为text去掉'搜资源'后的内容
        const media = text.replace('搜资源', '').trim()
        // 如果
        if (media) {
          const mediaItem = ChatFlowConfig.mediaList.find((item) => item.name === media)
          if (mediaItem) {
            await message.say(`「${mediaItem.name}」 ${mediaItem.link}`)
          } else {
            const res = await ServeGetMedias({ name: media })
            const mediaList = res.data.items
            if (mediaList.length === 0) {
              await message.say(`没有找到资源「${media}」,在群内@管理员可提供人工搜索`)
            } else {
              const mediaItem = mediaList.find((item:any) => item.state === '开启')
              if (mediaItem) {
                await message.say(`「${mediaItem.name}」${mediaItem.link}`)
                ChatFlowConfig.mediaList.push(mediaItem)
              } else {
                await message.say(`没有找到资源「${media}」,在群内@管理员可提供人工搜索`)
              }
            }
          }
        }
      }
    } catch (e) {
      log.error('搜资源失败 error:', e)
    }

    // 群消息处理，判断非机器人自己发的消息
    const room = message.room()
    const isSelf = message.self()
    if (room && room.id && !isSelf) {
      try {
      // 活动管理
        await handleActivityManagement(message, room)
      } catch (e) {
        log.error('活动管理失败 error:', e)
      }

      // @机器人消息处理，当引用消息仅包含@机器人时，提取引用消息内容并回复
      try {
        await extractAtContent(message)
      } catch (e) {
        log.error('提取@消息失败 error:', e)
      }

      // 检测顺风车信息，如果text中包含车找人或人找车关键字，则提取信息并回复
      if (text.includes('车找人') || text.includes('人找车')) {
        try {
          const rideInfo = await getFormattedRideInfo(message)
          // log.info('rideInfo信息:', JSON.stringify(rideInfo, null, 2))
          logger.info('rideInfo信息:' + JSON.stringify(rideInfo, null, 2))
          const res = await ServeCreateCarpoolings(rideInfo)
          log.info('保存顺风车信息:', JSON.stringify(res.data, null, 2))
        } catch (e) {
          log.error('检测顺风车信息失败 error:', e)
        }
      }
    }

    // 消息存储到云表格，维格表或者飞书多维表格
    if (ChatFlowConfig.configEnv.VIKA_UPLOADMESSAGETOVIKA) {
      try {
        const messageToCloud = await formatMessageToCloud(message)
        if (messageToCloud) await saveMessageToCloud(messageToCloud)
      } catch (e) {
        log.error('消息写入云表格失败:\n', e)
      }
    }

    // 消息通过MQTT上报
    try {
      const mqttProxy = MqttProxy.getInstance()
      if (mqttProxy && mqttProxy.isOk && ChatFlowConfig.configEnv.MQTT_MQTTMESSAGEPUSH) {
        const messageToMQTT = await formatMessageToMQTT(message)
        const eventMessagePayload = eventMessage('onMessage', messageToMQTT)
        mqttProxy.pubEvent(eventMessagePayload)
      }
    } catch (e) {
      log.error('消息MQTT上报失败:\n', e)
    }

    // 保存文件到S3
    if (ChatFlowConfig.configEnv.secretAccessKey) {
      try {
        await uploadMessage(message)
      } catch (e) {
        log.error('消息S3上传失败:\n', e)
      }

    }
  }
}

export default onMessage
