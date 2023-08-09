/* eslint-disable promise/always-return */
/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { ICreateRecordsReqParams, Vika } from '@vikadata/vika'
import type { ReadStream } from 'fs'
import moment from 'moment'
// import { type } from 'os'
// import { v4 } from 'uuid'
// import rp from 'request-promise'

// import schedule from 'node-schedule'

import fs from 'fs'
import console from 'console'

import {
  Contact,
  log,
  Message,
  Room,
  ScanStatus,
  types,
  Wechaty,
} from 'wechaty'
import { FileBox } from 'file-box'

import type { Sheets, Field } from './lib/vikaModel/Model.js'
import { sheets } from './lib/vikaModel/index.js'
import { waitForMs as wait } from '../util/tool.js'

// import { sheets } from './lib/dataModel.js'

type VikaBotConfigTypes = {
  spaceName: string,
  token: string,
}

class VikaBot {

  token!: string
  spaceName!: string
  vika!: Vika
  spaceId!: string
  messageSheet: any
  commandSheet: any
  contactSheet: any
  qaSheet: any
  roomListSheet: any
  configSheet!: string
  switchSheet!: string
  roomWhiteListSheet!: string
  contactWhiteListSheet!: string
  noticeSheet!: string
  msgStore!: any[]
  envsOnVika!:any[]
  switchsOnVika!:any[]

  constructor (config: VikaBotConfigTypes) {
    if (!config.token) {
      console.error('未配置token，请在config.ts中配置')
    } else if (!config.spaceName) {
      console.error('未配置空间名称，请在config.ts中配置')
    } else {
      this.token = config.token
      this.spaceName = config.spaceName
      this.vika = new Vika({ token: this.token })
      this.spaceId = ''
      this.msgStore = []
      // this.checkInit()
    }
  }

  async getAllSpaces () {
    // 获取当前用户的空间站列表
    const spaceListResp = await this.vika.spaces.list()
    if (spaceListResp.success) {
      // console.log(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      console.error(spaceListResp)
      return spaceListResp
    }
  }

  async getSpaceId () {
    const spaceList: any = await this.getAllSpaces()
    for (const i in spaceList) {
      if (spaceList[i].name === this.spaceName) {
        this.spaceId = spaceList[i].id
        break
      }
    }
    if (this.spaceId) {
      return this.spaceId
    } else {
      return ''
    }
  }

  async getNodesList () {
    // 获取指定空间站的一级文件目录
    const nodeListResp = await this.vika.nodes.list({ spaceId: this.spaceId })
    const tables: any = {}
    if (nodeListResp.success) {
      // console.log(nodeListResp.data.nodes);
      const nodes = nodeListResp.data.nodes
      nodes.forEach((node: any) => {
        // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
        if (node.type === 'Datasheet') {
          tables[node.name] = node.id
        }
      })
    } else {
      console.error(nodeListResp)
    }
    return tables
  }

  async getSheetFields (datasheetId: string) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const fieldsResp = await datasheet.fields.list()
    let fields: any = []
    if (fieldsResp.success) {
      console.log(JSON.stringify(fieldsResp.data.fields))
      fields = fieldsResp.data.fields
    } else {
      console.error(fieldsResp)
    }
    return fields
  }

  async createDataSheet (key: string, name: string, fields: { name: string; type: string }[]) {

    const datasheetRo = {
      fields,
      name,
    }

    try {
      const res: any = await this.vika.space(this.spaceId).datasheets.create(datasheetRo)

      console.log(`系统表【${name}】创建成功，表ID【${res.data.id}】`)

      this[key as keyof VikaBot] = res.data.id
      this[name as keyof VikaBot] = res.data.id
      const delres = await this.clearBlankLines(res.data.id)
      console.log('删除空白行：', delres)
      return res.data
    } catch (error) {
      console.error(name, error)
      return error
      // TODO: handle error
    }
  }

  async createRecord (datasheetId: string, records: ICreateRecordsReqParams) {
    log.info('createRecord:', records)
    const datasheet = await this.vika.datasheet(datasheetId)

    try {
      const res = await datasheet.records.create(records)
      if (res.success) {
        // console.log(res.data.records)
      } else {
        console.error('记录写入维格表失败：', res)
      }
    } catch (err) {
      console.error('请求维格表写入失败：', err)
    }

  }

  async addChatRecord (msg: { talker: () => any; to: () => any; type: () => any; text: () => any; room: () => any; id: any }, uploadedAttachments: any, msgType: any, text: string) {
    // console.debug(msg)
    // console.debug(JSON.stringify(msg))
    const talker = msg.talker()
    // console.debug(talker)
    // const to = msg.to()
    // const type = msg.type()
    text = text || msg.text()
    const room = msg.room()
    let topic = ''
    if (room) {
      topic = await room.topic()
    }
    const curTime = this.getCurTime()
    // const reqId = v4()
    // const ID = msg.id
    // let msgType = msg.type()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files = []
    if (uploadedAttachments) {
      files.push(uploadedAttachments)
      text = JSON.stringify(uploadedAttachments)
    }

    const record = {
      fields: {
        timeHms,
        name: talker ? talker.name() : '未知',
        topic: topic || '--',
        messagePayload: text,
        wxid: talker.id !== 'null' ? talker.id : '--',
        roomid: room && room.id ? room.id : '--',
        messageType: msgType,
        file: files,
      },
    }
    // log.info('addChatRecord:', JSON.stringify(record))
    this.msgStore.push(record)
    log.info('最新消息池长度：', this.msgStore.length)
  }

  addRecord (record:any) {
    log.info('addRecord:', JSON.stringify(record))
    if (record.fields) {
      this.msgStore.push(record)
      log.info('最新消息池长度：', this.msgStore.length)
    }

  }

  async addScanRecord (uploadedAttachments: string, text: string) {

    const curTime = this.getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files = []
    if (uploadedAttachments) {
      files.push(uploadedAttachments)
    }

    const records = [
      {
        fields: {
          timeHms,
          name: 'system',
          topic: '--',
          messagePayload: text,
          wxid: 'system',
          roomid: '--',
          messageType: 'qrcode',
          file: files,
        },
      },
    ]

    log.info('addScanRecord:', records)
    const datasheet = this.vika.datasheet(this.messageSheet)
    datasheet.records.create(records).then((response) => {
      if (response.success) {
        console.log('写入vika成功：', response.code)
      } else {
        console.error('调用vika写入接口成功，写入vika失败：', response)
      }
      return response
    }).catch(err => { console.error('调用vika写入接口失败：', err) })
  }

  async addHeartbeatRecord (text: string) {

    const curTime = this.getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []

    const record = {
      fields: {
        timeHms,
        name: 'system',
        topic: '--',
        messagePayload: text,
        wxid: 'system',
        roomid: '--',
        messageType: 'heartbeat',
        file: files,
      },
    }
    log.info('addHeartbeatRecord:', JSON.stringify(record))
    this.msgStore.push(record)
  }

  async upload (file: ReadStream) {
    const datasheet = this.vika.datasheet(this.messageSheet)
    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploadedAttachments = resp.data
        console.debug('上传成功', uploadedAttachments)
        return uploadedAttachments
      }
    } catch (error: any) {
      console.error(error.message)
      return error
    }

  }

  async deleteRecords (datasheetId: string, recordsIds: string | any[]) {
    // console.debug('操作数据表ID：', datasheetId)
    // console.debug('待删除记录IDs：', recordsIds)
    const datasheet = this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)
    if (response.success) {
      console.log(`删除${recordsIds.length}条记录`)
    } else {
      console.error('删除记录失败：', response)
    }
  }

  async getRecords (datasheetId: string, query = {}) {
    let records: any = []
    const datasheet = await this.vika.datasheet(datasheetId)
    // 分页获取记录，默认返回第一页
    const response = await datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // console.log(records)
    } else {
      console.error(response)
      records = response
    }
    return records
  }

  async getAllRecords (datasheetId: string) {
    let records = []
    const datasheet = await this.vika.datasheet(datasheetId)
    const response: any = await datasheet.records.queryAll()
    // console.debug('原始返回：',response)
    if (response.next) {
      for await (const eachPageRecords of response) {
        // console.debug('eachPageRecords:',eachPageRecords.length)
        records.push(...eachPageRecords)
      }
      // console.debug('records:',records.length)
    } else {
      console.error(response)
      records = response
    }
    return records
  }

  async clearBlankLines (datasheetId: any) {
    const records = await this.getRecords(datasheetId, {})
    // console.debug(records)
    const recordsIds = []
    for (const i in records) {
      recordsIds.push(records[i].recordId)
    }
    // console.debug(recordsIds)
    await this.deleteRecords(datasheetId, recordsIds)
  }

  async updateConfigToVika (config:any) {
    const functionOnStatus = config.functionOnStatus
    const botConfig = config.botConfig
    log.info('functionOnStatus', functionOnStatus)
    log.info('botConfig', botConfig)

  }

  async downConfigFromVika () {
    const configRecords = await this.getRecords(this.configSheet, {})
    const switchRecords = await this.getRecords(this.switchSheet, {})
    // console.debug(configRecords)
    // console.debug(switchRecords)

    const sysConfig: any = {}
    const botConfig: any = {}
    const botConfigIdMap: any = {}
    const functionOnStatus:any = {}
    const functionOnStatusIdMap:any = {}
    const roomWhiteList:any = []
    const contactWhiteList:any = []
    const welcomeList:any = []

    for (let i = 0; i < configRecords.length; i++) {
      const fields = configRecords[i].fields
      const recordId = configRecords[i].recordId

      if (!botConfig[fields['配置组标识']]) {
        botConfig[fields['配置组标识']] = {}
      }

      botConfig[fields['配置组标识']][fields['标识']] = fields['值']
      botConfigIdMap[fields['配置组标识']][fields['标识']] = recordId
    }

    this.envsOnVika = botConfigIdMap

    for (let i = 0; i < switchRecords.length; i++) {
      const fields = switchRecords[i].fields
      const recordId = switchRecords[i].recordId

      if (!functionOnStatus[fields['配置组标识']]) {
        functionOnStatus[fields['配置组标识']] = {}
      }
      functionOnStatus[fields['配置组标识']][fields['标识']] = fields['启用状态'] === '开启'
      functionOnStatusIdMap[fields['配置组标识']][fields['标识']] = recordId
    }

    this.switchsOnVika = functionOnStatusIdMap

    const roomWhiteListRecords: any[] = await this.getRecords(this.roomWhiteListSheet, {})
    for (let i = 0; i < roomWhiteListRecords.length; i++) {
      if (roomWhiteListRecords[i].fields['群ID']) {
        roomWhiteList.push(roomWhiteListRecords[i].fields['群ID'])
      }
    }

    const contactWhiteListRecords = await this.getRecords(this.contactWhiteListSheet, {})
    for (let i = 0; i < contactWhiteListRecords.length; i++) {
      if (contactWhiteListRecords[i].fields['好友ID']) {
        contactWhiteList.push(contactWhiteListRecords[i].fields['好友ID'])
      }
    }
    log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))
    log.info('botConfig', JSON.stringify(botConfig, null, '\t'))
    log.info('functionOnStatus', JSON.stringify(functionOnStatus, null, '\t'))

    sysConfig.functionOnStatus = functionOnStatus
    sysConfig.botConfig = botConfig
    sysConfig.contactWhiteList = contactWhiteList
    sysConfig.roomWhiteList = roomWhiteList
    sysConfig.welcomeList = welcomeList

    return sysConfig

  }

  async getConfig () {
    const configRecords = await this.getRecords(this.configSheet, {})
    const switchRecords = await this.getRecords(this.switchSheet, {})
    // console.debug(configRecords)
    // console.debug(switchRecords)

    // const sysConfig = {
    //   VIKA_ONOFF: config['消息上传到维格表'] === '开启', // 维格表开启
    //   puppetName: config['puppet'],  // 支持wechaty-puppet-wechat、wechaty-puppet-xp、wechaty-puppet-padlocal
    //   puppetToken: config['wechaty-token'] || '',
    //   WX_TOKEN: config['对话平台token'], // 微信对话平台token
    //   EncodingAESKey: config['对话平台EncodingAESKey'], // 微信对话平台EncodingAESKey
    //   WX_OPENAI_ONOFF: config['智能问答'] === '开启', // 微信对话平台开启
    //   roomWhiteListOpen: config['群白名单'] === '开启', // 群白名单功能
    //   contactWhiteListOpen: config['好友白名单'] === '开启', // 群白名单功能
    //   AT_AHEAD: config['AT回复'] === '开启', // 只有机器人被@时回复
    //   DIFF_REPLY_ONOFF: config['不同群个性回复'] === '开启', // 开启不同群个性化回复
    //   imOpen: config['IM对话'] === '开启',  // 是否开启uve-im客户端，设置为true时，需要先 cd ./vue-im 然后 npm install 启动服务 npm run dev
    //   mqtt_SUB_ONOFF: config['MQTT控制'] === '开启',
    //   mqtt_PUB_ONOFF: config['MQTT推送'] === '开启',
    //   mqttUsername: config['MQTT用户名'] || '',
    //   mqttPassword: config['MQTT密码'] || '',
    //   mqttEndpoint: config['MQTT接入地址'] || '',
    //   mqttPort: config['MQTT端口号'] || 1883,
    // }

    const sysConfig: any = {}
    const botConfig: any = {}
    const botConfigIdMap: any = {}
    const functionOnStatus:any = {}
    const functionOnStatusIdMap:any = {}
    sysConfig.roomWhiteList = []
    sysConfig.contactWhiteList = []

    for (let i = 0; i < configRecords.length; i++) {
      const fields = configRecords[i].fields
      const recordId = configRecords[i].recordId

      if (fields['标识']) {
        sysConfig[configRecords[i].fields['标识']] = fields['值（只修改此列）'] || ''
      }
      if (!botConfig[fields['配置组标识']]) {
        botConfig[fields['配置组标识']] = {}
      }

      botConfig[fields['配置组标识']][fields['标识']] = fields['值（只修改此列）'] || fields['值']
      botConfigIdMap[fields['配置组标识']][fields['标识']] = recordId

    }

    this.envsOnVika = botConfigIdMap

    for (let i = 0; i < switchRecords.length; i++) {
      const fields = switchRecords[i].fields
      const recordId = switchRecords[i].recordId
      if (fields['标识']) {
        sysConfig[switchRecords[i].fields['标识']] = fields['启用状态（只修改此列）'] === '开启'
      }
      if (!functionOnStatus[fields['配置组标识']]) {
        functionOnStatus[fields['配置组标识']] = {}
      }
      functionOnStatus[fields['配置组标识']][fields['标识']] = fields['启用状态（只修改此列）'] === '开启' || fields['启用状态'] === '开启'
      functionOnStatusIdMap[fields['配置组标识']][fields['标识']] = recordId
    }

    this.switchsOnVika = functionOnStatusIdMap

    const roomWhiteListRecords: any[] = await this.getRecords(this.roomWhiteListSheet, {})
    for (let i = 0; i < roomWhiteListRecords.length; i++) {
      if (roomWhiteListRecords[i].fields['群ID']) {
        sysConfig.roomWhiteList.push(roomWhiteListRecords[i].fields['群ID'])
      }
    }

    const contactWhiteListRecords = await this.getRecords(this.contactWhiteListSheet, {})
    for (let i = 0; i < contactWhiteListRecords.length; i++) {
      if (contactWhiteListRecords[i].fields['好友ID']) {
        sysConfig.contactWhiteList.push(contactWhiteListRecords[i].fields['好友ID'])
      }
    }
    sysConfig.welcomeList = []
    log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))
    log.info('botConfig', JSON.stringify(botConfig, null, '\t'))
    log.info('functionOnStatus', JSON.stringify(functionOnStatus, null, '\t'))

    return sysConfig

  }

  async onMessage (message:Message) {
    try {

      let uploadedAttachments = ''
      const msgType = types.Message[message.type()]
      let file:any = ''
      let filePath = ''
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
            console.error('Image解析失败：', e)
            file = ''
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

          // console.debug(miniProgram)
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
            console.error('Audio解析失败：', e)
            file = ''
          }

          break

        // 视频消息
        case types.Message.Video:

          try {
            file = await message.toFileBox()

          } catch (e) {
            console.error('Video解析失败：', e)
            file = ''
          }
          break

        // 动图表情消息
        case types.Message.Emoticon:

          try {
            file = await message.toFileBox()

          } catch (e) {
            console.error('Emoticon解析失败：', e)
            file = ''
          }

          break

        // 文件消息
        case types.Message.Attachment:

          try {
            file = await message.toFileBox()

          } catch (e) {
            console.error('Attachment解析失败：', e)
            file = ''
          }

          break
        // 文件消息
        case types.Message.Location:

          // const location = await message.toLocation()
          // text = JSON.stringify(JSON.parse(JSON.stringify(location)).payload)
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
        filePath = './' + file.name
        try {
          const writeStream = fs.createWriteStream(filePath)
          await file.pipe(writeStream)
          await wait(500)
          const readerStream = fs.createReadStream(filePath)
          uploadedAttachments = await this.upload(readerStream)
          fs.unlink(filePath, (err) => {
            console.debug('上传vika完成删除文件：', filePath, err)
          })
        } catch {
          console.debug('上传失败：', filePath)
          fs.unlink(filePath, (err) => {
            console.debug('上传vika失败删除文件', filePath, err)
          })
        }

      }

      if (message.type() !== types.Message.Unknown) {
        await this.addChatRecord(message, uploadedAttachments, msgType, text)
      }

    } catch (e) {
      console.log('vika 写入失败：', e)
    }
  }

  async onScan (qrcode:string, status:ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const qrcodeUrl = encodeURIComponent(qrcode)
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        qrcodeUrl,
      ].join('')
      // log.info('StarterBot', 'vika onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

      let uploadedAttachments = ''
      let file: FileBox
      let filePath = 'qrcode.png'
      try {
        file = FileBox.fromQRCode(qrcode)
        filePath = './' + file.name
        try {
          const writeStream = fs.createWriteStream(filePath)
          await file.pipe(writeStream)
          await wait(200)
          const readerStream = fs.createReadStream(filePath)
          uploadedAttachments = await this.upload(readerStream)
          const text = qrcodeImageUrl
          await this.addScanRecord(uploadedAttachments, text)
          fs.unlink(filePath, (err) => {
            log.info('二维码上传vika完成删除文件：', filePath, err)
          })
        } catch {
          log.info('二维码上传失败：', filePath)
          fs.unlink(filePath, (err) => {
            log.info('二维码上传vika失败删除文件', filePath, err)
          })
        }

      } catch (e) {
        log.info('二维码vika 写入失败：', e)
      }

    } else {
      log.info('StarterBot', 'vika onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  async updateContacts (bot:Wechaty) {
    let updateCount = 0
    try {
      const contacts: Contact[] = await bot.Contact.findAll()
      log.info('当前微信最新联系人数量：', contacts.length)
      const recordsAll: any = []
      const recordExisting = await this.getAllRecords(this.contactSheet)
      log.info('云端好友数量：', recordExisting.length)
      const wxids: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: { fields: any, id: any }) => {
          wxids.push(record.fields.id)
        })
      }
      for (let i = 0; i < contacts.length; i++) {
        const item = contacts[i]
        if (item && item.friend() && !wxids.includes(item.id)) {
          let avatar = ''
          try {
            avatar = String(await item.avatar())
          } catch (err) {

          }
          const fields = {
            alias: String(await item.alias() || ''),
            avatar,
            friend: item.friend(),
            gender: String(item.gender() || ''),
            id: item.id,
            name: item.name(),
            phone: String(await item.phone()),
            type: String(item.type()),
          }
          const record = {
            fields,
          }
          recordsAll.push(record)
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        await this.createRecord(this.contactSheet, records)
        log.info('好友列表同步中...', i + 10)
        updateCount = updateCount + 10
        void await wait(250)
      }

      log.info('同步好友列表完成，更新好友数量：', updateCount)
    } catch (err) {
      log.error('更新好友列表失败：', err)

    }

  }

  async updateRooms (bot: Wechaty) {
    let updateCount = 0
    try {
      const rooms: Room[] = await bot.Room.findAll()
      log.info('当前最新微信群数量：', rooms.length)
      const recordsAll: any = []
      const recordExisting = await this.getAllRecords(this.roomListSheet)
      log.info('云端群数量：', recordExisting.length)
      const wxids: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: { fields: any, id: any }) => {
          wxids.push(record.fields.id)
        })
      }
      for (let i = 0; i < rooms.length; i++) {
        const item = rooms[i]
        if (item && !wxids.includes(item.id)) {
          let avatar:any = 'null'
          try {
            avatar = String(await item.avatar())
          } catch (err) {
            log.error('获取群头像失败：', err)
          }
          const fields = {
            avatar,
            id: item.id,
            ownerId: String(item.owner()?.id || ''),
            topic: await item.topic() || '',
          }
          const record = {
            fields,
          }
          recordsAll.push(record)
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        await this.createRecord(this.roomListSheet, records)
        log.info('群列表同步中...', i + 10)
        updateCount = updateCount + 10
        void await wait(250)
      }

      log.info('同步群列表完成，更新群数量：', updateCount)
    } catch (err) {
      log.error('更新群列表失败：', err)

    }

  }

  async getTimedTask () {
    const taskRecords = await this.getRecords(this.noticeSheet, {})
    // console.debug(taskRecords)

    const timedTasks: any = []

    const taskFields: Field[] = sheets['noticeSheet']?.fields || []
    const taskFieldDic: any = {}

    for (let i = 0; i < taskFields.length; i++) {
      const taskField: Field | undefined = taskFields[i]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (taskFields && taskField !== undefined && taskFields[i]?.desc) {
        taskFieldDic[taskField.name] = taskField.desc
      }
    }

    for (let i = 0; i < taskRecords.length; i++) {
      const task = taskRecords[i]
      const taskConfig: any = {
        id: task.recordId,
        msg: task.fields['内容'],
        time: task.fields['时间'],
        cycle: task.fields['周期'],
        contacts: [],
        rooms: [],
        active: task.fields['启用状态'] === '开启',
      }

      if (taskConfig.msg && taskConfig.time && (task.fields['接收好友'] || task.fields['接收群'])) {

        if (task.fields['接收群'] && task.fields['接收群'].length) {
          const roomRecords = await this.getRecords(this.roomListSheet, { recordIds: task.fields['接收群'] })
          // console.debug(roomRecords)
          roomRecords.forEach(async (item: any) => {
            taskConfig.rooms.push(item.fields.id)
          })
        }
        if (task.fields['接收好友'] && task.fields['接收好友'].length) {
          const contactRecords = await this.getRecords(this.contactSheet, { recordIds: task.fields['接收好友'] })
          // console.debug(contactRecords)
          contactRecords.forEach(async (item: any) => {
            taskConfig.contacts.push(item.fields.id)
          })
        }
        timedTasks.push(taskConfig)
      }
    }

    // console.debug(2, timedTasks)

    return timedTasks

  }

  async checkInit (msg: string) {
    this.spaceId = await this.getSpaceId()
    // console.log('空间ID:', this.spaceId)
    let sheetCount = 0
    if (this.spaceId) {
      const tables = await this.getNodesList()
      // console.debug(tables)

      for (const k in sheets) {
        const sheet = sheets[k as keyof Sheets]
        // console.log(k, sheet)
        if (sheet) {
          if (!tables[sheet.name]) {
            sheetCount = sheetCount + 1
            console.error(`缺少【${sheet.name}】表，请运行 npm run sys-init 自动创建系统表,然后再运行 npm start`)
          } else {
            this[k as keyof VikaBot] = tables[sheet.name]
          }
        }
      }

      if (sheetCount === 0) {
        console.log(`\n================================================\n\n${msg}\n\n================================================\n`)
      } else {
        return false
      }

    } else {
      console.error('指定空间不存在，请先创建空间，并在config.json中配置vika信息')
      return false
    }

    const that = this
    setInterval(() => {
      // log.info('待处理消息池长度：', that.msgStore.length||0);
      // that.msgStore = that.msgStore.concat(global.sentMessage)
      // global.sentMessage = []

      if (that.msgStore.length && that.messageSheet) {
        const end = that.msgStore.length < 10 ? that.msgStore.length : 10
        const records = that.msgStore.splice(0, end)
        const messageSheet = that.messageSheet
        const datasheet = that.vika.datasheet(messageSheet)
        // log.info('写入vika的消息：', JSON.stringify(records))
        try {
          datasheet.records.create(records).then((response) => {
            if (response.success) {
              console.log('写入vika成功：', end, JSON.stringify(response.code))
            } else {
              console.error('调用vika写入接口成功，写入vika失败：', response)
            }
          }).catch(err => { console.error('调用vika写入接口失败：', err) })
        } catch (err) {
          console.error('调用datasheet.records.create失败：', err)
        }
      }
    }, 250)

    return true
  }

  async init () {

    this.spaceId = await this.getSpaceId()
    // console.log('空间ID:', this.spaceId)

    if (this.spaceId) {

      const tables = await this.getNodesList()
      // console.log(tables)

      await wait(1000)

      for (const k in sheets) {
        // console.debug(this)
        const sheet = sheets[k as keyof Sheets]
        // console.log(k, sheet)
        if (sheet && !tables[sheet.name]) {
          const fields = sheet.fields
          const newFields: Field[] = []
          for (let j = 0; j < fields.length; j++) {
            const field = fields[j]
            const newField: Field = {
              type: field?.type || '',
              name: field?.name || '',
              desc: field?.desc || '',
            }
            console.debug(field)
            let options
            switch (field?.type) {
              case 'SingleText':
                newField.property = field.property || {}
                newFields.push(newField)
                break
              case 'SingleSelect':
                options = field.property.options
                newField.property = {}
                newField.property.defaultValue = field.property.defaultValue || options[0].name
                newField.property.options = []
                for (let z = 0; z < options.length; z++) {
                  const option = {
                    name: options[z].name,
                    color: options[z].color.value,
                  }
                  newField.property.options.push(option)
                }
                newFields.push(newField)
                break
              case 'Text':
                newFields.push(newField)
                break
              case 'DateTime':
                newField.property = {}
                newField.property.dateFormat = 'YYYY-MM-DD'
                newField.property.includeTime = true
                newField.property.timeFormat = 'HH:mm'
                newField.property.autoFill = true
                newFields.push(newField)
                break
              case 'Checkbox':
                newField.property = {
                  icon: 'white_check_mark',
                }
                newFields.push(newField)
                break
              case 'MagicLink':
                newField.property = {}
                newField.property.foreignDatasheetId = this[field.desc as keyof VikaBot]
                if (field.desc) {
                  newFields.push(newField)
                }
                break
              case 'Attachment':
                newFields.push(newField)
                break
              default:
                newFields.push(newField)
                break
            }
            // if (field?.type !== 'MagicLink' || (field.type === 'MagicLink' && field.desc)) {
            //   newFields.push(newField)
            // }
          }

          // console.debug(newFields)

          await this.createDataSheet(k, sheet.name, newFields)
          await wait(200)
          const defaultRecords = sheet.defaultRecords
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (defaultRecords) {
            // console.debug(defaultRecords.length)
            const count = Math.ceil(defaultRecords.length / 10)
            for (let i = 0; i < count; i++) {
              const records = defaultRecords.splice(0, 10)
              console.log('写入：', records.length)
              await this.createRecord(this[k as keyof VikaBot], records)
              await wait(200)
            }
            console.log(sheet.name + '初始化数据写入完成...')
          }
          console.log(sheet.name + '数据表配置完成...')
        } else if (sheet) {
          this[k as keyof VikaBot] = tables[sheet.name]
          this[sheet.name as keyof VikaBot] = tables[sheet.name]
        } else { /* empty */ }
      }

      console.log('\n================================================\n\n初始化系统表完成,运行 npm start 启动系统\n\n================================================\n')

      // const tasks = await this.getTimedTask()
      return true
    } else {
      console.error('指定空间不存在，请先创建空间，并在config.json中配置vika信息')
      return false
    }
  }

  getCurTime () {
    // timestamp是整数，否则要parseInt转换
    const timestamp = new Date().getTime()
    const timezone = 8 // 目标时区时间，东八区
    const offsetGMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const time = timestamp + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000
    return time
  }

}

export { VikaBot }

export default VikaBot
