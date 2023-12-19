import {
  Message,
  Contact,
  log,
  types,
  ScanStatus,
} from 'wechaty'
import moment from 'moment'
import { db } from '../db/tables.js'
import { formatTimestamp, getCurrentTime, delay, logger, getCurTime } from '../utils/utils.js'
import type { ChatMessage } from '../types/interface.js'
import {
  MessageChat,
  LarkChat,
} from '../services/mod.js'
import { LarkDB } from '../db/lark-db.js'
import { ChatFlowConfig } from './base-config.js'
import fs from 'fs'
import path from 'path'

const MEDIA_PATH = 'data/media/image'
const MEDIA_PATH_QRCODE = path.join(MEDIA_PATH, 'qrcode')
const MEDIA_PATH_CONTACT = path.join(MEDIA_PATH, 'contact')
const MEDIA_PATH_ROOM = path.join(MEDIA_PATH, 'room')

const paths = [ MEDIA_PATH, MEDIA_PATH_QRCODE, MEDIA_PATH_CONTACT, MEDIA_PATH_ROOM ]

paths.forEach((p) => {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true })
  }
})

// 本地存储位置
const messageData = db.message

export interface MessageToDB {
  _id: string;
  data: Message;
  listener: Contact | undefined; // 请替换为实际的类型
  room: any;
  talker: Contact;
  time: string; // 假设 formatTimestamp 返回一个字符串
  timestamp: number; // 假设 timestamp 是一个数字
}

export const formatMessageToDB = async (message: Message) => {
  const talker = message.talker()
  const listener = message.listener()
  const room = message.room()
  let roomJson:any
  if (room) {
    roomJson = JSON.parse(JSON.stringify(room))
    delete roomJson.payload.memberIdList
  }
  const timestamp = message.payload?.timestamp ? (message.payload.timestamp * 1000) : new Date().getTime()
  const messageToDB: MessageToDB = {
    _id: message.id,
    data: message,
    listener:listener ?? undefined,
    room:roomJson,
    talker,
    time:formatTimestamp(timestamp)[5],
    timestamp,
  }
  return messageToDB
}

export const saveMessageToDB = async (message: MessageToDB) => {
  try {
    const res = await messageData.insert(message)
    log.info('消息写入数据库成功:', res._id)
    return res
  } catch (e) {
    // log.error('消息写入数据库失败:\n', e)
    return undefined
  }
}

export interface MessageToCloud {
  _id: string;
  data: Message;
  listener: Contact | undefined; // 请替换为实际的类型
  room: any;
  talker: Contact;
  time: string; // 假设 formatTimestamp 返回一个字符串
  timestamp: number; // 假设 timestamp 是一个数字
}

export const formatMessageToCloud = async (message: Message) => {
  log.info('formatMessageToCloud 消息转换为存储到多维表格的格式...')
  const room = message.room()
  const talker = message.talker()
  try {

    let uploadedAttachments:any = ''
    const msgType = types.Message[message.type()]
    let file: any
    let text = ''
    const files: any = []
    let urlLink
    let miniProgram

    switch (message.type()) {
      // 文本消息
      case types.Message.Text:
        text = message.text()
        break

        // 图片消息

      case types.Message.Image:{

        const img = await message.toImage()
        await delay(1500)
        try {
          file = await img.hd()
          // file = await message.toFileBox()

        } catch (e) {
          logger.error('Image解析img.hd()失败：', e)
          try {
            file = await img.thumbnail()
          } catch (e) {
            logger.error('Image解析img.thumbnail()失败：', e)
          }
        }

        break
      }

      // 链接卡片消息
      case types.Message.Url:
        urlLink = await message.toUrlLink()
        text = JSON.stringify(JSON.parse(JSON.stringify(urlLink)).payload)
        // file = await message.toFileBox();
        break

        // 小程序卡片消息
      case types.Message.MiniProgram:

        miniProgram = await message.toMiniProgram()

        text = JSON.stringify(JSON.parse(JSON.stringify(miniProgram)).payload)

        // logger.info(miniProgram)
        /*
          miniProgram: 小程序卡片数据
          {
            appid: "wx363a...",
            description: "贝壳找房 - 真房源",
            title: "美国白宫，10室8厅9卫，99999刀/月",
            iconUrl: "http://mmbiz.qpic.cn/mmbiz_png/.../640?wx_fmt=png&wxfrom=200",
            pagePath: "pages/home/home.html...",
            shareId: "0_wx363afd5a1384b770_..._1615104758_0",
            thumbKey: "84db921169862291...",
            thumbUrl: "3051020100044a304802010002046296f57502033d14...",
            username: "gh_8a51...@app"
          }
         */
        break

        // 语音消息
      case types.Message.Audio:
        await delay(1500)
        try {
          file = await message.toFileBox()
        } catch (e) {
          logger.error('Audio解析失败：', e)
          file = ''
        }

        break

        // 视频消息
      case types.Message.Video:
        await delay(1500)
        try {
          file = await message.toFileBox()

        } catch (e) {
          logger.error('Video解析失败：', e)
          file = ''
        }
        break

        // 动图表情消息
      case types.Message.Emoticon:

        try {
          file = await message.toFileBox()

        } catch (e) {
          logger.error('Emoticon解析失败：', e)
          file = ''
        }

        break

        // 文件消息
      case types.Message.Attachment:
        await delay(1500)
        try {
          file = await message.toFileBox()

        } catch (e) {
          logger.error('Attachment解析失败：', e)
          file = ''
        }

        break
        // 文件消息
      case types.Message.Location:

        // const location = await message.toLocation()
        text = message.text()
        break
      case types.Message.Unknown:
        // const location = await message.toLocation()
        // text = JSON.stringify(JSON.parse(JSON.stringify(location)).payload)
        break
        // 其他消息
      default:
        break
    }

    if (file) {
      // log.info('文件file:', file)
      try {
        text = JSON.stringify(file.toJSON())
        log.info('文件text:', text)
      } catch (e) {
        log.error('文件转换JSON失败：', e)
      }
      try {
        if (ChatFlowConfig.dataBaseType === 'lark' && LarkDB.config.appToken) {
          uploadedAttachments = await LarkChat.handleFileMessage(file, message)
          files.push({
            file_token: uploadedAttachments.file_token,
          })
          log.info('上传文件Lark成功：', JSON.stringify(uploadedAttachments))
        } else {
          uploadedAttachments = await MessageChat.handleFileMessage(file, message)
          files.push(uploadedAttachments.data)
          log.info('上传文件Vika成功：', JSON.stringify(uploadedAttachments))

        }
      } catch (e) {
        log.error('文件上传失败：', e)
      }
    }

    const listener = message.listener()
    let topic = ''
    if (room) {
      topic = await room.topic()
    }
    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    let wxAvatar:any = ''
    let roomAvatar:any = ''
    let listenerAvatar:any = ''
    try {
      wxAvatar = (await talker.avatar()).toJSON()
      wxAvatar = wxAvatar.url
    } catch (e) {
      logger.error('获取发言人头像失败：', e)
    }

    if (listener) {
      try {
        listenerAvatar = (await listener.avatar()).toJSON()
        listenerAvatar = listenerAvatar.url
      } catch (e) {
        logger.error('获取发言人头像失败：', e)
      }
    }

    if (room) {
      try {
        roomAvatar = (await room.avatar()).toJSON()
        roomAvatar = roomAvatar.url
      } catch (e) {
        logger.error('获取发言人头像失败：', e)
      }
    }

    try {

      if (msgType !== 'Unknown') {
        const record = {
          fields: {
            '时间|timeHms':timeHms,
            '发送者|name': talker.name(),
            '好友备注|alias': await talker.alias(),
            '群名称|topic': topic || '--',
            '消息内容|messagePayload': text,
            '好友ID|wxid': talker.id !== 'null' ? talker.id : '--',
            '群ID|roomid': room && room.id ? room.id : '--',
            '消息类型|messageType': msgType,
            '文件图片|file': files,
            '消息ID|messageId': message.id,
            '接收人|listener': topic ? '--' : (await listener?.alias() || listener?.name()),
            '接收人ID|listenerid':topic ? '--' : listener?.id,
            '发送者头像|wxAvatar': wxAvatar,
            '群头像|roomAvatar':roomAvatar,
            '接收人头像|listenerAvatar':listenerAvatar,
          },
        }
        // logger.info('addChatRecord:', JSON.stringify(record))
        return record
      } else {
        return undefined
      }
    } catch (e) {
      log.error('添加记录失败：', e)
      return undefined
    }
  } catch (e) {
    log.error('存储消息消息转换失败：', e)
    return undefined
  }

}

// 保存消息到云表格
export const saveMessageToCloud = async (record:any) => {
  // log.info('saveMessageToCloud messageNew:', JSON.stringify(messageNew))
  try {
    if (ChatFlowConfig.dataBaseType === 'lark') {
      log.info('消息写入到lark:', JSON.stringify(record))
      await LarkChat.addChatRecord(record)
    } else {
      log.info('消息写入到vika:', JSON.stringify(record))
      await MessageChat.addChatRecord(record)
    }
    // log.info('消息写入数据库成功:', res._id)
    return true
  } catch (e) {
    // log.error('消息写入数据库失败:\n', e)
    return false
  }

}

// 处理二维码上传
export const uploadQRCodeToCloud = async (qrcode: string, status: ScanStatus) => {
  if (ChatFlowConfig.dataBaseType === 'lark') {
    await LarkChat.uploadQRCodeToVika(qrcode, status)
  } else {
    await MessageChat.uploadQRCodeToVika(qrcode, status)
  }
}

// 上传图片/文件到云
export const uploadToCloud = async (path: string) => {
  log.info('uploadToCloud path:', path)
}

export const formatMessageToMQTT = async (message: Message) => {
  log.info('formatMessageToMQTT message:', JSON.stringify(message))
  const talker = message.talker()
  const listener = message.listener()
  const room = message.room()
  let roomJson:any
  if (room) {
    roomJson = JSON.parse(JSON.stringify(room))
    delete roomJson.payload.memberIdList
  }
  const messageType = types.Message[message.type()]
  let text = message.text()
  switch (message.type()) {
    case types.Message.Image:{
      const file = message.toImage()
      const fileBox = await file.artwork()
      text = JSON.stringify(fileBox.toJSON())
      break
    }
    case types.Message.Attachment:{
      const file = await message.toFileBox()
      text = JSON.stringify(file.toJSON())
      break
    }
    case types.Message.Video:{
      const file = await message.toFileBox()
      text = JSON.stringify(file.toJSON())
      break
    }
    case types.Message.Audio:{
      const file = await message.toFileBox()
      text = JSON.stringify(file.toJSON())
      break
    }
    default:
      break
  }
  log.info('formatMessageToMQTT text:', text)
  const timestamp = message.payload?.timestamp ? message.payload.timestamp : new Date().getTime()
  const messageNew = {
    _id: message.id,
    data: message,
    listener:listener ?? undefined,
    room:roomJson,
    talker,
    time:getCurrentTime(timestamp),
    timestamp,
    type: messageType,
    text,
  }
  // log.info('formatMessageToMQTT messageNew:', JSON.stringify(messageNew))
  return messageNew
}

export const formatMessageToLog = async (message: Message) => {
  const text = message.text()
  const talker = message.talker()
  const listener = message.listener()
  const room = message.room()
  const topic = await room?.topic()
  const type = message.type()

  const chatMessage: ChatMessage = {
    id: message.id,
    text,
    type,
    talker: {
      name: talker.name(),
      id: talker.id,
      alias: await talker.alias(),
    },
    room: {
      topic,
      id: room?.id,
    },
    listener: {
      id: listener?.id,
      name: listener?.name(),
      alias: await listener?.alias(),
    },
  }
  return chatMessage
}

// 发送消息
export const sendMsg = async (message: Message, text: string) => {
  const talker = message.talker()
  const room = message.room()
  if (room) {
    await room.say(text)
  } else {
    await talker.say(text)
  }
}

// 上传图片
export const uploadImage = async (message: Message, path: string) => {
  const talker = message.talker()
  const room = message.room()
  if (room) {
    await room.say(path)
  } else {
    await talker.say(path)
  }
}
