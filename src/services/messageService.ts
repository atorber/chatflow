/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { Message, ScanStatus, types, Wechaty, log } from 'wechaty'
import { getCurTime, delay, logger } from '../utils/utils.js'
import moment from 'moment'
import { FileBox } from 'file-box'

import { ChatFlowConfig } from '../api/base-config.js'
import type { ChatMessage } from '../types/mod.js'
import {
  ServeCreateTalkRecords,
  ServeCreateTalkRecordsUpload,
} from '../api/chat.js'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'

import { db } from '../db/tables.js'
const messageData = db.message

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

// 服务类
export class MessageChat {

  static msgStore: any[] = []
  static messageData: any
  static bot:Wechaty
  static batchCount: number = 10
  static delayTime: number = 1000

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串
  constructor () {
    MessageChat.batchCount = ChatFlowConfig.batchCount
    MessageChat.delayTime = ChatFlowConfig.delayTime
  }

  // 初始化
  static async init () {
    const that = this
    try {
      this.msgStore = []
      this.messageData = messageData

      // 启动定时任务，每秒钟写入一次，每次写入10条
      setInterval(() => {
        // logger.info('待处理消息池长度：', that.msgStore.length || '0')

        if (that.msgStore.length && ChatFlowConfig.isReady) {
          const end = that.msgStore.length < this.batchCount ? that.msgStore.length : this.batchCount
          const records = that.msgStore.splice(0, end)
          // logger.info('写入vika的消息：', JSON.stringify(records))
          try {
            ServeCreateTalkRecords({ records }).then((response: any) => {
              if (response.message !== 'success') {
                log.error('调用消息写入接口成功，写入失败：', JSON.stringify(response))
              } else {
                log.info('调用消息写入接口成功，写入成功：', response.data.length)
              }
              return response
            }).catch((err: any) => { log.error('调用消息写入接口失败：', err) })

          } catch (err) {
            logger.error('调用datasheet.records.create失败：', err)
          }
        } else if (!ChatFlowConfig.isReady) {
          log.info('机器人未初始化完成，待处理消息池等待中...')
        } else {
          // log.info('待处理消息池为空...', new Date().toLocaleString())
        }
        return null
      }, 1500)

      log.info('初始化 MessageChat 成功...')
    } catch (e) {
      log.error('初始化 MessageChat 失败：', e)
    }
    this.bot = ChatFlowConfig.bot
  }

  static addRecord (record: any) {
    logger.info('addRecord消息入列:', JSON.stringify(record))
    if (record.fields) {
      MessageChat.msgStore.push(record)
      // logger.info('最新消息池长度：', this.msgStore.length)
    }
  }

  static async addChatRecord (record:any) {

    try {
      MessageChat.msgStore.push(record)
      // logger.info('最新消息池长度：', this.msgStore.length)
    } catch (e) {
      logger.error('addChatRecord添加记录失败：', e)
    }

  }

  // 处理二维码上传
  static async uploadQRCodeToVika (qrcode: string, status: ScanStatus) {

    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {

      const qrcodeUrl = encodeURIComponent(qrcode)
      const qrcodeImageUrl = [ 'https://wechaty.js.org/qrcode/', qrcodeUrl ].join('')
      // logger.info('StarterBot', 'vika onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

      let uploadedAttachments:any = ''
      let file: FileBox
      let filePath = ''
      try {
        file = FileBox.fromQRCode(qrcode)
        filePath = `${MEDIA_PATH_QRCODE}/` + file.name
        try {
          // const writeStream = fs.createWriteStream(filePath)
          // await file.pipe(writeStream)
          await file.toFile(filePath, true)
          await delay(this.delayTime)
          // uploadedAttachments = await MessageChat.db?.upload(filePath, '')

          // 创建一个新的FormData实例
          const form = new FormData()
          // 添加文件到form实例。第一个参数是API期待的字段名
          form.append('file', fs.createReadStream(filePath))
          // 如果API需要特定的头部（如认证），可以在这里添加
          const config = {
            headers: {
              ...form.getHeaders(),
              // 'Authorization': 'Bearer yourToken' // 示例：如何添加认证头部
            },
          }
          uploadedAttachments = await ServeCreateTalkRecordsUpload(form, config)
          await delay(this.delayTime)
          log.info('上传二维码到vika结果：', JSON.stringify(uploadedAttachments))
          const text = qrcodeImageUrl
          if (uploadedAttachments.data) {
            try {
              await this.addScanRecord(uploadedAttachments, text)
              // fs.unlink(filePath, (err) => {
              //   logger.info('二维码上传vika完成删除文件：', filePath, err)
              // })
            } catch (err) {
              logger.error('二维码vika 写入失败：', err)
            }
          }
        } catch {
          logger.info('二维码上传失败：', filePath)
          // fs.unlink(filePath, (err) => {
          //   logger.info('二维码上传vika失败删除文件', filePath, err)
          // })
        }

      } catch (e) {
        logger.error('onScan,二维码vika 写入失败：', e)
      }

    } else {
      logger.info('机器人启动，二维码上传维格表', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  static async addScanRecord (uploadedAttachments: any, text: string) {

    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []
    if (uploadedAttachments.data) {
      files.push(uploadedAttachments.data)
    }

    const records = [
      {
        timeHms,
        name: 'system',
        topic: '--',
        messagePayload: text,
        wxid: 'system',
        roomid: '--',
        messageType: 'qrcode',
        file: files,
      },
    ]

    // logger.info('待写入登录二维码消息:', JSON.stringify(records))
    const response:any = await ServeCreateTalkRecords({ records })
    log.info('调用vika写入接口成功，写入vika结果：', JSON.stringify(response))

    // if (!response.message.success) {
    //   logger.error('调用vika写入接口成功，写入vika失败：', JSON.stringify(response))
    // }

    return response
  }

  static async handleFileMessage (file:FileBox, message: Message) {
    const fileName = file.name
    const room = message.room()
    const talker = message.talker()
    let filePath = `${MEDIA_PATH_CONTACT}/${talker.id}_${fileName}`
    if (room) {
      filePath = `${MEDIA_PATH_ROOM}/${room.id}_${fileName}`
    }

    // logger.info('文件路径filePath:', filePath)

    try {
      await file.toFile(filePath, true)
      logger.info('保存文件到本地成功', filePath)
    } catch (err) {
      logger.error('保存文件到本地失败', err)
      return ''
    }

    await delay(this.delayTime)
    // return await this.db?.upload(filePath, '')

    // 创建一个新的FormData实例
    const form = new FormData()
    // 添加文件到form实例。第一个参数是API期待的字段名
    form.append('file', fs.createReadStream(filePath))
    // 如果API需要特定的头部（如认证），可以在这里添加
    const config = {
      headers: {
        ...form.getHeaders(),
        // 'Authorization': 'Bearer yourToken' // 示例：如何添加认证头部
      },
    }
    const uploadedAttachments = await ServeCreateTalkRecordsUpload(form, config)
    await delay(this.delayTime)
    log.info('上传文件到vika结果：', JSON.stringify(uploadedAttachments))
    return uploadedAttachments
  }

  static async addHeartbeatRecord (text: string) {

    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []

    const record = {
      timeHms,
      name: 'system',
      topic: '--',
      messagePayload: text,
      wxid: 'system',
      roomid: '--',
      messageType: 'heartbeat',
      file: files,
    }
    logger.info('心跳消息:', JSON.stringify(record))
    MessageChat.msgStore.push(record)
  }

  static async onMessage (message: Message) {
    const room = message.room()
    const talker = message.talker()
    const files: any = []
    const type = message.type()
    try {

      let uploadedAttachments:any = ''
      const msgType = types.Message[message.type()]
      let file: any
      let text = ''

      let urlLink
      let miniProgram

      switch (type) {
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
          text = 'Unknown'
          break
        // 其他消息
        default:
          break
      }

      if (file) {
        // logger.info('文件file:', file)
        try {
          text = JSON.stringify(file.toJSON())
        } catch (e) {
          log.error('messageService 文件转换JSON失败：', e)
        }
        uploadedAttachments = await MessageChat.handleFileMessage(file, message)
        if (uploadedAttachments) {
          files.push(uploadedAttachments.data)
          // text = JSON.stringify(uploadedAttachments.data)
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
        const record:any = {
          timeHms,
          name: talker.name(),
          alias: await talker.alias(),
          topic: topic || '--',
          messagePayload: text,
          wxid: talker.id !== 'null' ? talker.id : '--',
          roomid: room && room.id ? room.id : '--',
          messageType: msgType,
          messageId: message.id,
          listener: topic ? '--' : (await listener?.alias() || listener?.name()),
          listenerid:topic ? '--' : listener?.id,
          wxAvatar,
          roomAvatar,
          listenerAvatar,
        }
        if (files.length) record['file'] = files
        // logger.info('addChatRecord:', JSON.stringify(record))
        if (msgType !== 'Unknown') {
          await this.addChatRecord(record)
        }
      } catch (e) {
        logger.error('onMessage添加记录失败：', e)

      }

    } catch (e) {
      logger.error('onMessage消息转换失败：', e)
    }
  }

  static async formatMessage (message: Message) {
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

}
