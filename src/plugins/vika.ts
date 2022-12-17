/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { ICreateRecordsReqParams, Vika } from '@vikadata/vika'
import type { ReadStream } from 'fs'
import moment from 'moment'
// import { type } from 'os'
// import { v4 } from 'uuid'
// import rp from 'request-promise'

import {
  log,
} from 'wechaty'

import type { Sheets, Field } from './lib/vikaModel/Model.js'
import { sheets } from './lib/vikaModel/index.js'

// import { sheets } from './lib/dataModel.js'

// 定义一个延时方法
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
  msgStore!: any[]

  constructor(config: VikaBotConfigTypes) {
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

  async getAllSpaces() {
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

  async getSpaceId() {
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

  async getNodesList() {
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

  async getSheetFields(datasheetId: string) {
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

  async createDataSheet(key: string, name: string, fields: { name: string; type: string }[]) {

    const datasheetRo = {
      fields,
      name,
    }

    try {
      const res: any = await this.vika.space(this.spaceId).datasheets.create(datasheetRo)

      console.log(`系统表【${name}】创建成功，表ID【${res.data.id}】`)

      this[key as keyof VikaBot] = res.data.id
      this[name as keyof VikaBot] = res.data.id
      await this.clearBlankLines(res.data.id)

      return res.data
    } catch (error) {
      console.error(name, error)
      return error
      // TODO: handle error
    }
  }

  async createRecord(datasheetId: string, records: ICreateRecordsReqParams) {
    const datasheet = await this.vika.datasheet(datasheetId)

    const res = await datasheet.records.create(records)

    if (res.success) {
      // console.log(res.data.records)
    } else {
      console.error(res)
    }

  }

  async addChatRecord(msg: { talker: () => any; to: () => any; type: () => any; text: () => any; room: () => any; id: any }, uploadedAttachments: any, msgType: any, text: string) {
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
        timeHms: timeHms,
        name: talker ? talker.name() : '未知',
        topic: topic || '--',
        messagePayload: text,
        wxid: talker.id !== 'null' ? talker.id : '--',
        roomid: room && room.id ? room.id : '--',
        messageType: msgType,
        file: files,
      },
    }

    this.msgStore.push(record)
    log.info('最新消息池长度：', this.msgStore.length);
  }

  async addScanRecord(uploadedAttachments: string, text: string) {

    const curTime = this.getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files = []
    if (uploadedAttachments) {
      files.push(uploadedAttachments)
    }

    const records = [
      {
        fields: {
          timeHms: timeHms,
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

    // console.debug(records)
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

  async addHeartbeatRecord(text: string) {

    const curTime = this.getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    const files: any = []

    const record = {
      fields: {
        timeHms: timeHms,
        name: 'system',
        topic: '--',
        messagePayload: text,
        wxid: 'system',
        roomid: '--',
        messageType: 'heartbeat',
        file: files,
      },
    }

    this.msgStore.push(record)
  }

  async upload(file: ReadStream) {
    const datasheet = this.vika.datasheet(this.messageSheet)
    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploadedAttachments = resp.data
        console.debug('上传成功', uploadedAttachments)
        // await vika.datasheet('dstWUHwzTHd2YQaXEE').records.create([{
        //   'title': '标题 A',
        //   'photos': [uploadedAttachments]
        // }])
        return uploadedAttachments
      }
    } catch (error: any) {
      console.error(error.message)
      return error
    }

  }

  async deleteRecords(datasheetId: string, recordsIds: string | any[]) {
    const datasheet = await this.vika.datasheet(datasheetId)
    const response = await datasheet.records.delete(recordsIds)

    if (response.success) {
      // console.log(`删除${recordsIds.length}条记录`)
    } else {
      console.error(response)
    }
  }

  async getRecords(datasheetId: string, query = {}) {
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

  async getAllRecords(datasheetId: string) {
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

  async clearBlankLines(datasheetId: any) {
    const records = await this.getRecords(datasheetId, {})
    const recordsIds = []
    for (const i in records) {
      recordsIds.push(records[i].recordId)
    }
    await this.deleteRecords(datasheetId, recordsIds)

  }

  async getConfig() {
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
    sysConfig.roomWhiteList = []
    sysConfig.contactWhiteList = []

    for (let i = 0; i < configRecords.length; i++) {
      sysConfig[configRecords[i].fields['标识']] = configRecords[i].fields['值（只修改此列）']||''
    }

    for (let i = 0; i < switchRecords.length; i++) {
      sysConfig[switchRecords[i].fields['标识']] = switchRecords[i].fields['启用状态（只修改此列）'] === '开启'
    }

    const roomWhiteListRecords: any[] = await this.getRecords(this.roomWhiteListSheet, {})
    for (let i = 0; i < roomWhiteListRecords.length; i++) {
      sysConfig.roomWhiteList.push(roomWhiteListRecords[i].fields['群ID'])
    }

    const contactWhiteListRecords = await this.getRecords(this.contactWhiteListSheet, {})
    for (let i = 0; i < contactWhiteListRecords.length; i++) {
      sysConfig.contactWhiteList.push(contactWhiteListRecords[i].fields['好友ID'])
    }

    // console.debug(sysConfig)

    return sysConfig

  }

  async checkInit(msg: string) {
    this.spaceId = await this.getSpaceId()
    console.log('空间ID:', this.spaceId)
    let sheetCount = 0
    if (this.spaceId) {
      const tables = await this.getNodesList()
      // console.debug(tables)

      for (let k in sheets) {
        const sheet = sheets[k as keyof Sheets]
        // console.log(k, sheet)
        if (sheet) {
          if (!tables[sheet.name]) {
            sheetCount = sheetCount + 1
            console.error(`缺少【${sheet.name}】表，请运行 npm run sys-init 自动创建系统表,然后再运行 npm start`)
          } else {
            this[k as keyof VikaBot] = tables[sheet?.name]
          }
        }
      }

      if (sheetCount === 0) {
        console.log(`================================================\n\n${msg}\n\n================================================\n`)
      } else {
        return false
      }

    } else {
      console.error('指定空间不存在，请先创建空间，并在config.ts中配置VIKA_SPACENAME')
      return false
    }

    const that = this
    let timer_id = setInterval(async () => {
      // log.info('待处理消息池长度：', that.msgStore.length||0);
      if (that.msgStore.length && that.messageSheet) {
        const end = that.msgStore.length < 10 ? that.msgStore.length : 10
        const records = that.msgStore.splice(0, end)
        const messageSheet = that.messageSheet
        const datasheet = that.vika.datasheet(messageSheet)

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
    }, 250);

    console.info(timer_id)

    return true
  }

  async init() {

    this.spaceId = await this.getSpaceId()
    console.log('空间ID:', this.spaceId)

    if (this.spaceId) {

      const tables = await this.getNodesList()
      // console.log(tables)

      await wait(1000)

      for (let k in sheets) {
        // console.debug(this)
        const sheet = sheets[k as keyof Sheets]
        // console.log(k, sheet)
        if (sheet && !tables[sheet.name]) {
          const fields = sheet.fields
          const newFields: Field[] = []
          for (let j = 0; j < fields.length; j++) {
            let field = fields[j]
            let newField: Field = {
              type: field?.type || '',
              name: field?.name || '',
              desc: field?.desc || ''
            }

            switch (field?.type) {
              case 'SingleText':
                newField.property = field.property || {}
                break
              case 'SingleSelect':
                const options = field.property.options
                newField.property = {}
                newField.property.defaultValue = field.property.defaultValue || options[0].name
                newField.property.options = []
                for (let z = 0; z < options.length; z++) {
                  let option = {
                    name: options[z].name,
                    color: options[z].color.value
                  }
                  newField.property.options.push(option)
                }
                break
              case 'Text':
                break
              case 'DateTime':
                newField.property = {}
                newField.property.dateFormat = "YYYY-MM-DD"
                newField.property.includeTime = true
                newField.property.timeFormat = 'HH:mm'
                newField.property.autoFill = true
                break
              case 'Checkbox':
                newField.property = {
                  icon: 'white_check_mark',
                }
                break
              case 'MagicLink':
                newField.property = {}
                newField.property.foreignDatasheetId = this[field.desc as keyof VikaBot]
                break
              case 'Attachment':
                break
              default:
                break
            }
            if (field?.type !== 'MagicLink' || (field?.type === 'MagicLink' && field?.desc)) {
              newFields.push(newField)
            }
          }

          // console.debug(newFields)

          await this.createDataSheet(k, sheet.name, newFields)
          await wait(200)
          const defaultRecords = sheet.defaultRecords
          if (defaultRecords) {
            // console.debug(defaultRecords.length)
            const count = Math.ceil(defaultRecords.length / 10)
            for (let i = 0; i < count; i++) {
              let records = defaultRecords.splice(0, 10)
              console.log('写入：', records.length)
              await this.createRecord(this[k as keyof VikaBot], records)
              await wait(200)
            }
            console.log(sheet.name + '初始化数据写入完成...')
          }
          console.log(sheet.name + '数据表配置完成...')
        } else if (sheet) {
          this[k as keyof VikaBot] = tables[sheet.name]
          this[sheet?.name as keyof VikaBot] = tables[sheet.name]
        } else {

        }
      }

      console.log('================================================\n\n初始化系统表完成,运行 npm start 启动系统\n\n================================================\n')

    } else {
      console.error('指定空间不存在，请先创建空间，并在config.ts中配置VIKA_SPACENAME')
    }
  }

  getCurTime() {
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
