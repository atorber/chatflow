import { Message, log } from 'wechaty'
import {
  formatMessageToMQTT,
  formatMessageToDB,
  saveMessageToDB,
  formatMessageToLog,
  formatMessageToCloud,
  saveMessageToCloud,
} from '../api/message.js'
import { ChatFlowCore } from '../api/base-config.js'
// import {
//   logForm,
// } from '../utils/mod.js'

import { MqttProxy, eventMessage } from '../proxy/mqtt-proxy.js'
import { uploadMessage } from '../proxy/s3-proxy.js'

import { adminAction } from '../api/admin.js'
import { qa } from '../app/qa.js'
import { chatbot } from '../app/chatbot.js'
import { handleActivityManagement } from '../app/activity.js'
import { extractAtContent } from '../app/extract-at.js'
import { ServeGetMedias } from '../api/media.js'
import { ServeCreateCarpoolings } from '../api/carpooling.js'
import { sendMsg } from '../services/configService.js'

import { getFormattedRideInfo } from '../plugins/mod.js'

export async function onMessage (message: Message) {
  // log.info('收到消息:', JSON.stringify(message, null, 2))
  const text = message.text()
  const isSelf = message.self()
  const talker = message.talker()
  // log.info('talker', JSON.stringify(talker, null, 2))
  const room = message.room()
  // log.info('room', JSON.stringify(room, null, 2))
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
    log.info('格式化消息：', JSON.stringify(chatMessage, null, 2))
  } catch (e) {
    log.error('消息格式化失败:\n', e)
  }

  if (ChatFlowCore.isReady) {

    if (!isSelf) {
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
        if (text && ChatFlowCore.keywordList.length > 0) {
          log.info('检测关键字回复...')
          const keywordItem = ChatFlowCore.keywordList.find((item) => item.name === text && item.type === '等于关键字')
          if (keywordItem) {
            log.info('触发关键字回复，关键字是:', keywordItem.name)
            await sendMsg(message, keywordItem.desc)
          }
        }
      } catch (e) {
        log.error('关键字回复失败 error:', e)
      }

      // 群消息处理，判断非机器人自己发的消息
      if (room && room.id) {
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

        // 检测顺风车信息，如果text中包含车找人、人找车、车找n人、n人找车(其中n是一个数字)关键字，则提取信息并回复
        if (text.includes('车找') || text.includes('找车')) {
          try {
            const rideInfo = await getFormattedRideInfo(message)
            // log.info('rideInfo信息:', JSON.stringify(rideInfo, null, 2))
            ChatFlowCore.logger.info('rideInfo信息:' + JSON.stringify(rideInfo, null, 2))
            const res = await ServeCreateCarpoolings(rideInfo)
            log.info('保存顺风车信息:', JSON.stringify(res.data, null, 2))
          } catch (e) {
            log.error('检测顺风车信息失败 error:', e)
          }
        }

        // 检测text中是否存在微信ID以及回复内容，提取出nickName、wxid和text，例如text="瓦力：[luyuchao@ledongmao]\n 你在干嘛」\n- - - - - - - - - - - - - - -\n好的，我知道了",则提取出luyuchao、ledongmao和你在干嘛
        try {
          const atContent = text.match(/\[(.+)@(.+)\]\n(.+)」\n(.+)\n(.+)/)
          log.info('atContent:', atContent)
          if (atContent) {
            const nickName = atContent[1]
            const wxid = atContent[2]
            log.info('nickName:', nickName, 'wxid:', wxid)

            // 如果wxid不是weixin或者gh_开头的公众号ID，则提取出回复内容并回复
            if (wxid) {
              const contact = await ChatFlowCore.bot.Contact.find({ id: wxid })
              const content = text.split('- - -\n')[1]
              if (contact && content) {
                await sendMsg(contact, content)
              }
            }
          } else {
            log.info('没有找到微信ID')
          }
        } catch (e) {
          log.error('提取微信ID失败 error:', e)
        }

      } else {
        // 转发私信消息到adminRoom
        const wxid = talker.id
        if (ChatFlowCore.adminRoom  && ![ 'weixin' ].includes(wxid) && wxid.includes('gh_') === false && process.env['ADMINROOM_ADMINROOMID']) {
          const adminRoom = ChatFlowCore.adminRoom
          await sendMsg(adminRoom, `[${talker.name()}@${talker.id}]\n ${message.text()}`)
        }
      }

    }
    // 请求管理员群操作
    try {
      await adminAction(message)
    } catch (e) {
      log.error('管理员操作失败 error:', e)
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
          const mediaItem = ChatFlowCore.mediaList.find((item) => item.name === media)
          if (mediaItem) {
            await sendMsg(message, `「${mediaItem.name}」 ${mediaItem.link}`)
          } else {
            const res = await ServeGetMedias({ name: media })
            const mediaList = res.data.items
            if (mediaList.length === 0) {
              await sendMsg(message, `没有找到资源「${media}」,在群内@管理员可提供人工搜索`)
            } else {
              const mediaItem = mediaList.find((item:any) => item.state === '开启')
              if (mediaItem) {
                await sendMsg(message, `「${mediaItem.name}」${mediaItem.link}`)
                ChatFlowCore.mediaList.push(mediaItem)
              } else {
                await sendMsg(message, `没有找到资源「${media}」,在群内@管理员可提供人工搜索`)
              }
            }
          }
        }
      }
    } catch (e) {
      log.error('搜资源失败 error:', e)
    }

    // 消息存储到云表格，维格表或者飞书多维表格
    if (ChatFlowCore.configEnv.VIKA_UPLOADMESSAGETOVIKA) {
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
      if (mqttProxy && mqttProxy.isOk && ChatFlowCore.configEnv.MQTT_MQTTMESSAGEPUSH) {
        const messageToMQTT = await formatMessageToMQTT(message)
        const eventMessagePayload = eventMessage('onMessage', messageToMQTT)
        mqttProxy.pubEvent(eventMessagePayload)
      }
    } catch (e) {
      log.error('消息MQTT上报失败:\n', e)
    }

    // 保存文件到S3
    if (ChatFlowCore.configEnv.secretAccessKey) {
      try {
        await uploadMessage(message)
      } catch (e) {
        log.error('消息S3上传失败:\n', e)
      }

    }
  }
}

export default onMessage
