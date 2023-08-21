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
import { waitForMs as wait } from '../utils/utils.js'

// import { sheets } from './lib/dataModel.js'

type VikaBotConfigTypes = {
  spaceName: string,
  token: string,
}

export interface TaskConfig {
  id: string;
  msg: string;
  time: string;
  cycle: string;
  targetType: 'contact' | 'room';
  targetId: string;
  targetName: string;
  active: boolean;
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
      log.error('未配置token，请在config.ts中配置')
    } else if (!config.spaceName) {
      log.error('未配置空间名称，请在config.ts中配置')
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
      // log.info(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      log.error('获取空间列表失败:', spaceListResp)
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
      // log.info(nodeListResp.data.nodes);
      const nodes = nodeListResp.data.nodes
      nodes.forEach((node: any) => {
        // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
        if (node.type === 'Datasheet') {
          tables[node.name] = node.id
        }
      })
    } else {
      log.error('获取数据表失败:', nodeListResp)
    }
    return tables
  }

  async getSheetFields (datasheetId: string) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const fieldsResp = await datasheet.fields.list()
    let fields: any = []
    if (fieldsResp.success) {
      log.info('getSheetFields获取字段：', JSON.stringify(fieldsResp.data.fields))
      fields = fieldsResp.data.fields
    } else {
      log.error('获取字段失败:', fieldsResp)
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

      log.info(`系统表【${name}】创建成功，表ID【${res.data.id}】`)

      this[key as keyof VikaBot] = res.data.id
      this[name as keyof VikaBot] = res.data.id
      // 删除空白行
      await this.clearBlankLines(res.data.id)
      return res.data
    } catch (error) {
      log.error(name, error)
      return error
      // TODO: handle error
    }
  }

  async createRecord (datasheetId: string, records: ICreateRecordsReqParams) {
    log.info('写入维格表:', records.length)
    const datasheet = await this.vika.datasheet(datasheetId)

    try {
      const res = await datasheet.records.create(records)
      if (res.success) {
        // log.info(res.data.records)
      } else {
        log.error('记录写入维格表失败：', res)
      }
    } catch (err) {
      log.error('请求维格表写入失败：', err)
    }

  }

  async addChatRecord (msg: Message, uploadedAttachments: any, msgType: any, text: string) {
    // log.info(msg)
    // log.info(JSON.stringify(msg))
    const talker = msg.talker()
    // log.info(talker)
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

    try {
      if (uploadedAttachments) {
        files.push(uploadedAttachments)
        text = JSON.stringify(uploadedAttachments)
      }

      const record = {
        fields: {
          timeHms,
          name:  talker.name(),
          alias: await talker.alias(),
          topic: topic || '--',
          messagePayload: text,
          wxid: talker.id !== 'null' ? talker.id : '--',
          roomid: room && room.id ? room.id : '--',
          messageType: msgType,
          file: files,
          messageId:msg.id,
        },
      }
      // log.info('addChatRecord:', JSON.stringify(record))
      this.msgStore.push(record)
      log.info('最新消息池长度：', this.msgStore.length)
    } catch (e) {
      log.error('添加记录失败：', e)

    }

  }

  addRecord (record:any) {
    log.info('消息入列:', JSON.stringify(record))
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

    log.info('登录二维码消息:', records)
    const datasheet = this.vika.datasheet(this.messageSheet)
    datasheet.records.create(records).then((response) => {
      if (response.success) {
        log.info('写入vika成功：', response.code)
      } else {
        log.error('调用vika写入接口成功，写入vika失败：', JSON.stringify(response))
      }
      return response
    }).catch(err => { log.error('调用vika写入接口失败：', err) })
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
    log.info('心跳消息:', JSON.stringify(record))
    this.msgStore.push(record)
  }

  async upload (file: ReadStream) {
    const datasheet = this.vika.datasheet(this.messageSheet)
    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploadedAttachments = resp.data
        log.info('文件上传成功', uploadedAttachments)
        return uploadedAttachments
      }
    } catch (error: any) {
      log.error(error.message)
      return error
    }

  }

  async deleteRecords (datasheetId: string, recordsIds: string | any[]) {
    // log.info('操作数据表ID：', datasheetId)
    // log.info('待删除记录IDs：', recordsIds)
    const datasheet = this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)
    if (response.success) {
      log.info(`删除${recordsIds.length}条记录`)
    } else {
      log.error('删除记录失败：', response)
    }
  }

  async getRecords (datasheetId: string, query = {}) {
    let records: any = []
    const datasheet = await this.vika.datasheet(datasheetId)
    // 分页获取记录，默认返回第一页
    const response = await datasheet.records.query(query)
    if (response.success) {
      records = response.data.records
      // log.info(records)
    } else {
      log.error('获取数据记录失败：', response)
      records = response
    }
    return records
  }

  async getAllRecords (datasheetId: string) {
    let records = []
    const datasheet = await this.vika.datasheet(datasheetId)
    const response: any = await datasheet.records.queryAll()
    // log.info('原始返回：',response)
    if (response.next) {
      for await (const eachPageRecords of response) {
        // log.info('eachPageRecords:',eachPageRecords.length)
        records.push(...eachPageRecords)
      }
      // log.info('records:',records.length)
    } else {
      log.error(response)
      records = response
    }
    return records
  }

  async clearBlankLines (datasheetId: any) {
    const records = await this.getRecords(datasheetId, {})
    // log.info(records)
    const recordsIds = []
    for (const i in records) {
      recordsIds.push(records[i].recordId)
    }
    // log.info(recordsIds)
    await this.deleteRecords(datasheetId, recordsIds)
  }

  async updateConfigToVika (config:any) {
    const functionOnStatus = config.functionOnStatus
    const botConfig = config.botConfig
    log.info('维格表内功能开关状态', functionOnStatus)
    log.info('维格表内基础配置信息', botConfig)
  }

  async downConfigFromVika () {
    const configRecords = await this.getRecords(this.configSheet, {})
    const switchRecords = await this.getRecords(this.switchSheet, {})
    // log.info(configRecords)
    // log.info(switchRecords)

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
    await wait(1000)
    const switchRecords = await this.getRecords(this.switchSheet, {})
    await wait(1000)
    // log.info(configRecords)
    // log.info(switchRecords)

    const sysConfig: any = {
      contactWhiteList:[],
      roomWhiteList:[],
    }
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
        botConfig[configRecords[i].fields['标识']] = fields['值'] || ''
        botConfigIdMap[configRecords[i].fields['标识']] = recordId
      }
    }

    this.envsOnVika = botConfigIdMap

    for (let i = 0; i < switchRecords.length; i++) {
      const fields = switchRecords[i].fields
      const recordId = switchRecords[i].recordId
      if (fields['标识']) {
        functionOnStatus[switchRecords[i].fields['标识']] = fields['启用状态'] === '开启'
        functionOnStatusIdMap[switchRecords[i].fields['标识']] = recordId
      }
    }

    this.switchsOnVika = functionOnStatusIdMap

    const roomWhiteListRecords: any[] = await this.getRecords(this.roomWhiteListSheet, {})
    await wait(1000)
    for (let i = 0; i < roomWhiteListRecords.length; i++) {
      if (roomWhiteListRecords[i].fields['群名称']) {
        sysConfig.roomWhiteList.push(roomWhiteListRecords[i].fields['群名称'])
      } else {
        sysConfig.roomWhiteList.push(roomWhiteListRecords[i].fields['群名ID'])
      }
    }

    const contactWhiteListRecords = await this.getRecords(this.contactWhiteListSheet, {})
    await wait(1000)
    for (let i = 0; i < contactWhiteListRecords.length; i++) {
      if (contactWhiteListRecords[i].fields['备注']) {
        sysConfig.contactWhiteList.push(contactWhiteListRecords[i].fields['备注'])
      } else if (contactWhiteListRecords[i].fields['昵称']) {
        sysConfig.contactWhiteList.push(contactWhiteListRecords[i].fields['昵称'])
      } else {
        sysConfig.contactWhiteList.push(contactWhiteListRecords[i].fields['好友ID'])
      }
    }
    sysConfig['welcomeList'] = []
    sysConfig['botConfig'] = botConfig
    sysConfig['botConfigIdMap'] = botConfigIdMap
    sysConfig['functionOnStatus'] = functionOnStatus
    sysConfig['functionOnStatusIdMap'] = functionOnStatusIdMap

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
            log.error('Image解析失败：', e)
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
        filePath = 'data/media/image/' + file.name
        try {
          const writeStream = fs.createWriteStream(filePath)
          await file.pipe(writeStream)
          await wait(1000)
          const readerStream = fs.createReadStream(filePath)
          uploadedAttachments = await this.upload(readerStream)
          fs.unlink(filePath, (err) => {
            log.info('上传vika完成删除文件：', filePath, err)
          })
        } catch {
          log.info('上传失败：', filePath)
          fs.unlink(filePath, (err) => {
            log.info('上传vika失败删除文件', filePath, err)
          })
        }

      }

      if (message.type() !== types.Message.Unknown) {
        await this.addChatRecord(message, uploadedAttachments, msgType, text)
      }

    } catch (e) {
      log.info('vika 写入失败：', e)
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
          await wait(1000)
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
      log.info('机器人启动，二维码上传维格表', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  async updateContacts (bot:Wechaty) {
    let updateCount = 0
    try {
      const contacts: Contact[] = await bot.Contact.findAll()
      log.info('当前微信最新联系人数量：', contacts.length)
      const recordsAll: any = []
      const recordExisting = await this.getAllRecords(this.contactSheet)
      log.info('云端好友数量：', recordExisting.length || '0')
      const wxids: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: { fields: any, id: any }) => {
          wxids.push(record.fields.id)
        })
      }
      for (let i = 0; i < contacts.length; i++) {
        const item = contacts[i]
        const isFriend = item?.friend()
        // log.info('好友详情：', item?.name(), JSON.stringify(isFriend))
        if (item && isFriend && item.type() === types.Contact.Individual && !wxids.includes(item.id)) {
          // log.info('云端不存在：', item.name())
          let avatar = ''
          try {
            avatar = String(await item.avatar())
          } catch (err) {
            log.error('获取好友头像失败：', err)
          }
          const fields = {
            alias: String(await item.alias() || ''),
            avatar,
            friend: item.friend(),
            gender: String(item.gender() || ''),
            updated: new Date().toLocaleString(),
            id: item.id,
            name: item.name(),
            phone: String(await item.phone()),
            type: String(item.type()),
          }
          const record = {
            fields,
          }
          recordsAll.push(record)
        } else {
          log.info('云端已存在：', item?.name())
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        await this.createRecord(this.contactSheet, records)
        log.info('好友列表同步中...', i + 10)
        updateCount = updateCount + 10
        void await wait(1000)
      }

      log.info('同步好友列表完成，更新好友数量：', updateCount || '0')
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
        const item:Room|undefined = rooms[i]
        if (item && !wxids.includes(item.id)) {
          let avatar:any = 'null'
          try {
            avatar = await item.avatar()
            avatar = avatar.name
          } catch (err) {
            log.error('获取群头像失败：', err)
          }
          const ownerId = await item.owner()?.id
          log.info('第一个群成员：', ownerId)
          const fields = {
            avatar,
            id: item.id,
            ownerId: ownerId || '',
            topic: await item.topic() || '',
            updated: new Date().toLocaleString(),
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
        void await wait(1000)
      }

      log.info('同步群列表完成，更新群数量：', updateCount || '0')
    } catch (err) {
      log.error('更新群列表失败：', err)

    }

  }

  async getTimedTask () {
    const taskRecords = await this.getRecords(this.noticeSheet, {})
    log.info('定时提醒任务列表：', JSON.stringify(taskRecords))

    let timedTasks: any = []

    const taskFields: Field[] = sheets['noticeSheet']?.fields || []
    const taskFieldDic: any = {}

    for (let i = 0; i < taskFields.length; i++) {
      const taskField: Field | undefined = taskFields[i]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (taskFields && taskField !== undefined && taskFields[i]?.desc) {
        taskFieldDic[taskField.name] = taskField.desc
      }
    }

    interface TaskRecord {
      recordId: string;
      fields: {
        [key: string]: any;
      };
    }

    // 优化后的代码
    timedTasks = taskRecords.map((task: TaskRecord) => {
      const taskConfig: TaskConfig = {
        id: task.recordId,
        msg: task.fields['内容'],
        time: task.fields['时间'],
        cycle: task.fields['周期'] || '无重复',
        targetType: task.fields['通知目标类型'] === '好友' ? 'contact' : 'room',
        targetId: task.fields['好友ID/群ID'],
        targetName: task.fields['好友备注/昵称或群名称'],
        active: task.fields['启用状态'] === '开启',
      }

      if (taskConfig.active && taskConfig.msg && taskConfig.time && taskConfig.cycle && (taskConfig.targetId || taskConfig.targetName)) {
        return taskConfig
      }

      return null
    }).filter(Boolean)
    // log.info(2, timedTasks)

    return timedTasks

  }

  async checkInit (msg: string) {
    this.spaceId = await this.getSpaceId()
    // log.info('空间ID:', this.spaceId)
    let sheetCount = 0
    if (this.spaceId) {
      const tables = await this.getNodesList()
      // log.info(tables)

      for (const k in sheets) {
        const sheet = sheets[k as keyof Sheets]
        // log.info(k, sheet)
        if (sheet) {
          if (!tables[sheet.name]) {
            sheetCount = sheetCount + 1
            log.error(`缺少【${sheet.name}】表，请运行 npm run sys-init 自动创建系统表,然后再运行 npm start`)
          } else {
            this[k as keyof VikaBot] = tables[sheet.name]
          }
        }
      }

      if (sheetCount === 0) {
        log.info(`\n${msg}\n\n================================================\n`)
      } else {
        return false
      }

    } else {
      log.error('指定空间不存在，请先创建空间，并在config.json中配置vika信息')
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
              log.info('写入vika成功：', end, JSON.stringify(response.code))
            } else {
              log.error('调用vika写入接口成功，写入vika失败：', JSON.stringify(response))
            }
          }).catch(err => { log.error('调用vika写入接口失败：', err) })
        } catch (err) {
          log.error('调用datasheet.records.create失败：', err)
        }
      }
    }, 1000)

    return true
  }

  async init () {

    this.spaceId = await this.getSpaceId()
    // log.info('空间ID:', this.spaceId)

    if (this.spaceId) {

      const tables = await this.getNodesList()
      log.info('维格表文件列表：', JSON.stringify(tables))

      await wait(1000)

      for (const k in sheets) {
        // log.info(this)
        const sheet = sheets[k as keyof Sheets]
        // log.info(k, sheet)
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
            log.info('字段定义：', JSON.stringify(field))
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

          // log.info(newFields)

          await this.createDataSheet(k, sheet.name, newFields)
          await wait(1000)
          const defaultRecords = sheet.defaultRecords
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (defaultRecords) {
            // log.info(defaultRecords.length)
            const count = Math.ceil(defaultRecords.length / 10)
            for (let i = 0; i < count; i++) {
              const records = defaultRecords.splice(0, 10)
              log.info('写入：', records.length)
              await this.createRecord(this[k as keyof VikaBot], records)
              await wait(1000)
            }
            log.info(sheet.name, '初始化数据写入完成...')
          }
          log.info(sheet.name, '数据表配置完成...')
        } else if (sheet) {
          this[k as keyof VikaBot] = tables[sheet.name]
          this[sheet.name as keyof VikaBot] = tables[sheet.name]
        } else { /* empty */ }
      }

      log.info('\n初始化系统表完成,运行 npm start 启动系统\n\n================================================\n')

      // const tasks = await this.getTimedTask()
      return true
    } else {
      log.error('指定空间不存在，请先创建空间，并在.env文件或环境变量中配置vika信息')
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
