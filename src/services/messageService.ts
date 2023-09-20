/* eslint-disable sort-keys */
import type { VikaBot } from '../db/vika-bot.js'

import { VikaSheet } from '../db/vika.js'
import { Message, ScanStatus, log, types } from 'wechaty'
import { getCurTime, waitForMs as wait } from '../utils/utils.js'
import moment from 'moment'
import { FileBox } from 'file-box'

// import { db } from '../db/tables.js'
// const messageData = db.message

const MEDIA_PATH = 'data/media/image/'

async function handleFileMessage (file:FileBox, db:VikaSheet) {
  const fileName = file.name
  const filePath = `${MEDIA_PATH}${fileName}`
  // log.info('文件路径filePath:', filePath)

  try {
    await file.toFile(filePath, true)
    log.info('保存文件到本地成功')
  } catch (err) {
    log.error('保存文件到本地失败', err)
    return ''
  }

  await wait(1000)
  return await db.upload(filePath, '')
}

// 服务类
export class MessageChat {

  private db:VikaSheet
  vikaBot: VikaBot
  msgStore!: any[]

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.messageSheet)
    this.msgStore = []
    void this.init()
  }

  // 初始化
  async init () {
    const that = this
    setInterval(() => {
      // log.info('待处理消息池长度：', that.msgStore.length || '0')

      if (that.msgStore.length) {
        const end = that.msgStore.length < 10 ? that.msgStore.length : 10
        const records = that.msgStore.splice(0, end)
        // log.info('写入vika的消息：', JSON.stringify(records))
        try {
          this.db.insert(records).then((response: { success: any }) => {
            if (!response.success) {
              log.error('调用vika写入接口成功，写入vika失败：', JSON.stringify(response))
            }
            return response
          }).catch((err: any) => { log.error('调用vika写入接口失败：', err) })
        } catch (err) {
          log.error('调用datasheet.records.create失败：', err)
        }
      }
    }, 1000)
  }

  addRecord (record: any) {
    log.info('消息入列:', JSON.stringify(record))
    if (record.fields) {
      this.msgStore.push(record)
      // log.info('最新消息池长度：', this.msgStore.length)
    }
  }

  async addChatRecord (msg: Message, uploadedAttachments: any, msgType: any, text: string) {
    const talker = msg.talker()
    const listener = msg.listener()
    text = text || msg.text()
    const room = msg.room()
    let topic = ''
    if (room) {
      topic = await room.topic()
    }
    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []

    try {
      if (uploadedAttachments) {
        files.push(uploadedAttachments.data)
        text = JSON.stringify(uploadedAttachments.data)
      }

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
          '消息ID|messageId': msg.id,
          '接收人|listener': topic ? '--' : (await listener?.alias() || listener?.name()),
          '接收人ID|listenerid':topic ? '--' : listener?.id,
        },
      }
      // log.info('addChatRecord:', JSON.stringify(record))
      this.msgStore.push(record)
      log.info('最新消息池长度：', this.msgStore.length)
    } catch (e) {
      log.error('添加记录失败：', e)

    }

  }

  async addScanRecord (uploadedAttachments: any, text: string) {

    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []
    if (uploadedAttachments.data) {
      files.push(uploadedAttachments.data)
    }

    const records = [
      {
        fields: {
          '时间|timeHms':timeHms,
          '发送者|name': 'system',
          '群名称|topic': '--',
          '消息内容|messagePayload': text,
          '好友ID|wxid': 'system',
          '群ID|roomid': '--',
          '消息类型|messageType': 'qrcode',
          '文件图片|file': files,
        },
      },
    ]

    // log.info('待写入登录二维码消息:', JSON.stringify(records))
    const response = await this.db.insert(records)
    if (!response.success) {
      log.error('调用vika写入接口成功，写入vika失败：', JSON.stringify(response))
    }
    return response
  }

  async addHeartbeatRecord (text: string) {

    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []

    const record = {
      fields: {
        '时间|timeHms':timeHms,
        '发送者|name': 'system',
        '群名称|topic': '--',
        '消息内容|messagePayload': text,
        '好友ID|wxid': 'system',
        '群ID|roomid': '--',
        '消息类型|messageType': 'heartbeat',
        '文件图片|file': files,
      },
    }
    log.info('心跳消息:', JSON.stringify(record))
    this.msgStore.push(record)
  }

  async onMessage (message: Message) {
    try {

      let uploadedAttachments:any = ''
      const msgType = types.Message[message.type()]
      let file: any
      let text = ''

      let urlLink
      let miniProgram

      switch (message.type()) {
        // 文本消息
        case types.Message.Text:
          text = message.text()
          break

          // 图片消息

        case types.Message.Image:

          try {
            // await wait(2500)
            // const img = await message.toImage()
            // file = await img.thumbnail()
            file = await message.toFileBox()

          } catch (e) {
            log.error('Image解析失败：', e)
          }

          break

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

          // log.info(miniProgram)
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

          try {
            file = await message.toFileBox()

          } catch (e) {
            log.error('Audio解析失败：', e)
            file = ''
          }

          break

        // 视频消息
        case types.Message.Video:

          try {
            file = await message.toFileBox()

          } catch (e) {
            log.error('Video解析失败：', e)
            file = ''
          }
          break

        // 动图表情消息
        case types.Message.Emoticon:

          try {
            file = await message.toFileBox()

          } catch (e) {
            log.error('Emoticon解析失败：', e)
            file = ''
          }

          break

        // 文件消息
        case types.Message.Attachment:

          try {
            file = await message.toFileBox()

          } catch (e) {
            log.error('Attachment解析失败：', e)
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
        log.info('文件file:', file)
        uploadedAttachments = await handleFileMessage(file, this.db)
      }

      if (message.type() !== types.Message.Unknown) {
        await this.addChatRecord(message, uploadedAttachments, msgType, text)
      }

    } catch (e) {
      log.error('onMessage消息转换失败：', e)
    }
  }

  async onScan (qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const qrcodeUrl = encodeURIComponent(qrcode)
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        qrcodeUrl,
      ].join('')
      // log.info('StarterBot', 'vika onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

      let uploadedAttachments:any = ''
      let file: FileBox
      let filePath = ''
      try {
        file = FileBox.fromQRCode(qrcode)
        filePath = 'data/media/image/' + file.name
        try {
          // const writeStream = fs.createWriteStream(filePath)
          // await file.pipe(writeStream)
          await file.toFile(filePath, true)
          await wait(1000)
          uploadedAttachments = await this.db.upload(filePath, '')
          const text = qrcodeImageUrl
          if (uploadedAttachments.data) {
            try {
              await this.addScanRecord(uploadedAttachments, text)
              // fs.unlink(filePath, (err) => {
              //   log.info('二维码上传vika完成删除文件：', filePath, err)
              // })
            } catch (err) {
              log.error('二维码vika 写入失败：', err)
            }
          }
        } catch {
          log.info('二维码上传失败：', filePath)
          // fs.unlink(filePath, (err) => {
          //   log.info('二维码上传vika失败删除文件', filePath, err)
          // })
        }

      } catch (e) {
        log.error('onScan,二维码vika 写入失败：', e)
      }

    } else {
      log.info('机器人启动，二维码上传维格表', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

}
