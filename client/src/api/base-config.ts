/* eslint-disable sort-keys */
import type { ProcessEnv } from '../types/mod.js'

import {
  Contact,
  Room,
  Wechaty,
  log,
} from 'wechaty'
import type { WhiteList } from '../services/mod.js'
import type { BusinessRoom, BusinessUser } from './contact-room-finder.js'
import type {
  IClientOptions,
} from '../proxy/mqtt-proxy.js'
import CryptoJS from 'crypto-js'
import {
  ServeGetUserConfigObj,
  // ServeGetUserConfig,
} from '../api/user.js'

import { delay } from '../utils/utils.js'
import {
  ServeGetContactsRaw,
  ServeDeleteBatchContact,
  ServeCreateContactBatch,
  ServeContactGroupList,
} from '../api/contact.js'

import {
  ServeGetGroupsRaw,
  ServeDeleteBatchGroups,
  ServeCreateGroupBatch,
} from '../api/room.js'

import { ServeGetKeywords } from '../api/keyword.js'
import { ServeGetMedias } from '../api/media.js'
import { ServeGetWhitelistWhiteObject } from '../api/white-list.js'
import { ServeGetGroupnotices } from '../api/group-notice.js'
import { ServeGetStatistics } from '../api/statistic.js'
import { ServeGetNotices } from '../api/notice.js'
import {
  ServeGetChatbots,
  ServeGetChatbotUsers,
} from '../api/chatbot.js'
import { ServeGetWelcomes } from '../api/welcome.js'
import { ServeGetQas } from '../api/qa.js'
// import { DB } from '../db/nedb.js'
import { DataTables } from '../db/tables.js'

import * as winston from 'winston'
import * as path from 'path'

import type { ChatFlowOptions } from '../types/interface.js'

export interface ChatBotUser {
  id: string;
  botname: string;
  wxid: string;
  name: string;
  alias: string;
  quota: number;
  state: string;
  info: string;
  recordId: string;
  contact?: BusinessUser;
  room?: BusinessRoom;
  chatbot: ChatBot;
}

interface ChatBot {
  id: string;
  name: string;
  desc: string;
  type: string;
  model: string;
  prompt: string;
  quota: string;
  endpoint: string;
  key: string;
}

export type WechatyConfig = {
  puppet: string,
  token: string,
}

export interface Notifications {
  recordId: string
  text: string
  type: string
  name: string
  id?: string
  alias?: string
  state: string
  pubTime?: number
  info?: string
  room?: BusinessRoom
  contact?: BusinessUser
}

export interface TaskConfig {
  id: string;
  msg: string;
  time: number;
  cycle: string;
  targetType: 'contact' | 'room';
  target: BusinessRoom | BusinessUser;
  active: boolean;
  rule: string;
}

export interface DateBase {
  messageSheet: string
  keywordSheet: string
  contactSheet: string
  roomSheet: string
  envSheet: string
  whiteListSheet: string
  noticeSheet: string
  statisticSheet: string
  orderSheet: string
  stockSheet: string
  groupNoticeSheet: string
  qaSheet: string
  chatBotSheet: string
  chatBotUserSheet: string
  groupSheet: string
  welcomeSheet: string
  mediaSheet: string
}

export class BiDirectionalMap {

  private map: Map<string, string>
  private reverseMap: Map<string, string>

  constructor (fields: any[]) {
    const initPairs: [string, string][] = fields.map((fields: any) => {
      return this.transformKey(fields.name)
    })
    this.reverseMap = new Map(initPairs)
    this.map = new Map(initPairs.map(([ key, value ]) => [ value, key ]))
  }

  transformKey (key: string): [string, string] {
    return [ key, key.split('|')[1] || key ]
  }

  getKey (value: string): string | undefined {
    return this.reverseMap.get(value)
  }

  getValue (key: string): string | undefined {
    return this.map.get(key)
  }

}

export interface Database {
  activity:any;
  bot: any;
  config:any;
  contact: any;
  env:any;
  groupNotice:any;
  message: any;
  notice:any;
  order:any;
  room: any;
  whiteList:any;
}

export class ChatFlowCore {

  static chatFlowConfig: ChatFlowOptions
  static isLogin: boolean = false
  static isReady: boolean = false
  static delayTime: number = 1000
  static batchCount: number = 10
  static switchsOnVika: any[]
  static reminderList: any[]
  static statisticRecords: any
  static configEnv: ProcessEnv
  static spaceId: string
  static token: string = ''
  static adminRoomTopic: string
  static endpoint: string = 'http://127.0.0.1:9503'
  static dataDir: string = process.cwd()
  static bot: Wechaty
  static adminRoom: Room | undefined
  static logger: winston.Logger

  static tables: Database

  static db: {
    dataBaseIds: DateBase,
    dataBaseNames: DateBase,
    dataBaseIdsMap: {
      [key: string]: string;
    };
    spaceId: string,
    token: string,
  }

  static whiteList: WhiteList = {
    contactWhiteList: {
      qa: [],
      msg: [],
      act: [],
      gpt: [],
    },
    roomWhiteList: {
      qa: [],
      msg: [],
      act: [],
      gpt: [],
    },
  }

  static chatBotUsers: ChatBotUser[] = []
  static welcomeList: {
    id: string,
    topic: string,
    text: string,
    state: '开启' | '关闭',
  }[] = []

  static keywordList: {
    name: string,
    desc: string,
    type: string,
    details?: string,
  }[] = []

  static mediaList: {
    name: string,
    type: string,
    link: string,
    link1?: string,
    state: string,
  }[] = []

  static setOptions (options: {
    spaceId: string,
    token: string,
    endpoint?: string,
    dataDir?: string,
  }) {
    ChatFlowCore.dataDir = options.dataDir || ChatFlowCore.dataDir
    ChatFlowCore.tables = DataTables.createTables(ChatFlowCore.dataDir)
    ChatFlowCore.spaceId = options.spaceId || ChatFlowCore.spaceId
    ChatFlowCore.token = options.token || ChatFlowCore.token
    ChatFlowCore.endpoint = options.endpoint || ChatFlowCore.endpoint
    ChatFlowCore.batchCount = options.token.indexOf('/') === -1 ? 10 : 100
    ChatFlowCore.delayTime = options.token.indexOf('/') === -1 ? 1000 : 500
    // 创建一个 Winston 日志记录器实例
    ChatFlowCore.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: path.join(ChatFlowCore.dataDir, 'data/logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(ChatFlowCore.dataDir, 'data/logs/info.log') }),
      ],
    })
  }

  static async init (options: {
    spaceId?: string,
    token?: string,
    endpoint?: string,
  }) {
    ChatFlowCore.spaceId = options.spaceId || ChatFlowCore.spaceId
    ChatFlowCore.token = options.token || ChatFlowCore.token
    ChatFlowCore.endpoint = options.endpoint || ChatFlowCore.endpoint

    // log.info('初始化维格配置信息...,init()')
    try {
      const userConfig = await ServeGetUserConfigObj()
      // log.info('userConfig', JSON.stringify(userConfig))
      this.configEnv = userConfig.data
    } catch (err) {
      log.error('初始化配置信息失败：', err)
    }

    const wechatyConfig: WechatyConfig = {
      puppet: this.configEnv.WECHATY_PUPPET,
      token: this.configEnv.WECHATY_TOKEN,
    }

    // 计算clientid原始字符串
    const clientString = ChatFlowCore.token + ChatFlowCore.spaceId
    // clientid加密
    const client = CryptoJS.SHA256(clientString).toString()

    const protocol = this.configEnv.MQTT_ENDPOINT === '127.0.0.1' ? 'mqtt' : 'mqtts'
    const mqttConfig: IClientOptions = {
      username: this.configEnv.MQTT_USERNAME,
      password: this.configEnv.MQTT_PASSWORD,
      host: this.configEnv.MQTT_ENDPOINT,
      protocol,
      port: Number(this.configEnv.MQTT_PORT),
      clientId: client,
      clean: false,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      keepalive: 60,
      resubscribe: true,
      protocolId: 'MQTT',
      protocolVersion: 4,
      rejectUnauthorized: false,
    }

    // log.info('mqttConfig', JSON.stringify(mqttConfig, undefined, 2))
    const mqttIsOn = Boolean(this.configEnv.MQTT_MQTTMESSAGEPUSH || this.configEnv.MQTT_MQTTCONTROL)

    // log.info('vikaBot配置信息：', JSON.stringify(configVika, undefined, 2))

    return {
      wechatyConfig,
      mqttConfig,
      mqttIsOn,
    }

  }

  // 上传联系人列表
  static async updateContacts (puppet: string) {
    let updateCount = 0
    try {
      const contacts: Contact[] = await this.bot.Contact.findAll()
      log.info('最新联系人数量(包含公众号)：', contacts.length)
      ChatFlowCore.logger.info('最新联系人数量(包含公众号)：' + contacts.length)

      const recordsAll: any = []
      const recordRes = await ServeGetContactsRaw()
      const recordExisting = recordRes.data.items

      log.info('云端好友数量（不包含公众号）：', recordExisting.length || '0')
      ChatFlowCore.logger.info('云端好友数量（不包含公众号）：' + recordExisting.length || '0')

      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((fields: any) => {
          wxids.push(fields['id'] as string)
          recordIds.push(fields.recordId)
        })
      }
      ChatFlowCore.logger.info('当前bot使用的puppet:' + puppet)
      log.info('当前bot使用的puppet:', puppet)

      // 根据多维表格类型设置批量操作的数量和延迟时间
      const batchCount = ChatFlowCore.batchCount
      const delayTime = ChatFlowCore.delayTime

      // 如果是wechaty-puppet-wechat或wechaty-puppet-wechat4u，每次登录好友ID会变化，需要分批删除好友
      if (puppet === 'wechaty-puppet-wechat' || puppet === 'wechaty-puppet-wechat4u') {
        const count = Math.ceil(recordIds.length / batchCount)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, batchCount)
          log.info('删除：', records.length)
          await ServeDeleteBatchContact({ recordIds: records })
          await delay(delayTime)
        }
        wxids = []
      }

      for (let i = 0; i < contacts.length; i++) {
        const item = contacts[i]
        const isFriend = item?.friend() || false
        // const isIndividual = item?.type() === types.Contact.Individual
        // ChatFlowCore.logger.info('好友详情：' + item?.name())
        // log.info('是否好友：' + isFriend)
        // ChatFlowCore.logger.info('是否公众号：' + isIndividual)
        // if(item) log.info('头像信息：', (JSON.stringify((await item?.avatar()).toJSON())))
        if (item && isFriend && !wxids.includes(item.id)) {
          // ChatFlowCore.logger.info('云端不存在：' + item.name())
          let avatar: any = ''
          let alias = ''
          try {
            avatar = (await item.avatar()).toJSON()
            avatar = avatar.url
          } catch (err) {
            // ChatFlowCore.logger.error('获取好友头像失败：'+ err)
          }
          try {
            alias = await item.alias() || ''
          } catch (err) {
            ChatFlowCore.logger.error('获取好友备注失败：' + err)
          }
          const fields = {
            alias,
            avatar,
            friend: item.friend(),
            gender: String(item.gender() || ''),
            updated: new Date().toLocaleString(),
            id: item.id,
            name: item.name(),
            phone: String(await item.phone()),
            type: String(item.type()),
          }
          const record = fields
          recordsAll.push(record)
        }
      }
      ChatFlowCore.logger.info('待更新的好友数量：' + recordsAll.length || '0')

      for (let i = 0; i < recordsAll.length; i = i + batchCount) {
        const records = recordsAll.slice(i, i + batchCount)
        await ServeCreateContactBatch(records)
        log.info('好友列表同步中...' + i + records.length)
        updateCount = updateCount + records.length
        void await delay(batchCount)
      }

      log.info('同步好友列表完成，更新到云端好友数量：' + updateCount || '0')
    } catch (err) {
      log.error('更新好友列表失败：' + err)
    }
  }

  // 上传群列表
  static async updateRooms (puppet: string) {
    let updateCount = 0
    // 根据多维表格类型设置批量操作的数量和延迟时间
    const batchCount = ChatFlowCore.batchCount
    const delayTime = ChatFlowCore.delayTime
    try {
      // 获取最新的群列表
      const rooms: Room[] = await this.bot.Room.findAll()
      log.info('最新微信群数量：', rooms.length)
      const recordsAll: any = []

      // 从云端获取已有的群列表
      const roomsRes = await ServeGetGroupsRaw()
      const recordExisting = roomsRes.data.items
      ChatFlowCore.logger.info('云端群数量：' + recordExisting.length || '0')

      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((fields: any) => {
          if (fields['id']) {
            wxids.push(fields['id'] as string)
            recordIds.push(fields.recordId)
          }
        })
      }

      if (puppet === 'wechaty-puppet-wechat' || puppet === 'wechaty-puppet-wechat4u') {
        const count = Math.ceil(recordIds.length / batchCount)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, batchCount)
          ChatFlowCore.logger.info('删除：', records.length)
          await ServeDeleteBatchGroups({ recordIds: records })
          await delay(delayTime)
        }
        wxids = []
      }

      for (let i = 0; i < rooms.length; i++) {

        const item: Room | undefined = rooms[i]
        // if(item) log.info('头像信息：', (JSON.stringify((await item.avatar()).toJSON())))

        if (item && !wxids.includes(item.id)) {
          let avatar: any = 'null'
          try {
            avatar = (await item.avatar()).toJSON()
            avatar = avatar.url
          } catch (err) {
            // ChatFlowCore.logger.error('获取群头像失败：' + err)
          }
          const ownerId = await item.owner()?.id
          //   ChatFlowCore.logger.info('第一个群成员：' + ownerId)
          const fields = {
            avatar,
            id: item.id,
            ownerId: ownerId || '',
            topic: await item.topic() || '',
            updated: new Date().toLocaleString(),
          }
          const record = fields
          recordsAll.push(record)
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + batchCount) {
        const records = recordsAll.slice(i, i + batchCount)
        try {
          await ServeCreateGroupBatch(records)
          ChatFlowCore.logger.info('群列表同步完成...' + i + records.length)
          updateCount = updateCount + records.length
          void await delay(delayTime)
        } catch (err) {
          ChatFlowCore.logger.error('群列表同步失败,待系统就绪后再管理群发送【更新通讯录】可手动更新...' + i + batchCount)
          void await delay(delayTime)
        }
      }

      ChatFlowCore.logger.info('同步群列表完成，更新到云端群数量：' + updateCount || '0')
    } catch (err) {
      ChatFlowCore.logger.error('更新群列表失败：' + err)

    }

  }

  // 获取关键字文案
  static async getKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.items

    let text: string = '【操作说明】\n'
    for (const fields of records) {
      text += `${fields['name']}：${fields['desc']}\n`
    }
    return text
  }

  // 获取系统关键字文案
  static async getSystemKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.items
    ChatFlowCore.keywordList = records
    let text: string = '【操作说明】\n'
    for (const fields of records) {
      if (fields['type'] === '系统指令') text += `${fields['name']} : ${fields['desc']}\n`
    }
    return text
  }

  // 更新媒体资源库
  static async updateMediaList () {
    const res = await ServeGetMedias({})
    const mediaList = res.data.items
    log.info('获取的媒体资源库：' + JSON.stringify(mediaList))
  }

  // 更新环境变量
  static async updateEnv () {
    const res = await ServeGetUserConfigObj()
    const env = res.data
    log.info('获取的环境变量：' + JSON.stringify(env))
  }

  // 更新分组
  static async updateGroup () {
    const res = await ServeContactGroupList()
    const groups = res.data.items
    log.info('获取的分组：' + JSON.stringify(groups))
  }

  // 更新智聊用户名单
  static async updateChatBotUser () {
    const res = await ServeGetChatbotUsers()
    const chatBotUsers = res.data
    log.info('获取的智聊用户名单：' + JSON.stringify(chatBotUsers))
  }

  // 更新智聊ChatBot
  static async updateChatBot () {
    const res = await ServeGetChatbots()
    const chatBots = res.data
    log.info('获取的智聊ChatBot：' + JSON.stringify(chatBots))
  }

  // 更新白名单
  static async updateWhiteList () {
    const res = await ServeGetWhitelistWhiteObject()
    const whiteList = res.data
    log.info('获取的白名单：' + JSON.stringify(whiteList))
  }

  // 更新群发通知
  static async updateGroupNotifications () {
    const res = await ServeGetGroupnotices()
    const groupNotifications = res.data
    log.info('获取的群发通知：' + JSON.stringify(groupNotifications))
  }

  // 更新统计打卡
  static async updateStatistics () {
    const res = await ServeGetStatistics()
    const statistics = res.data.items
    log.info('获取的统计打卡：' + JSON.stringify(statistics))
  }

  // 更新定时提醒
  static async updateReminder () {
    const res = await ServeGetNotices()
    const reminders = res.data.items
    log.info('获取的定时提醒：' + JSON.stringify(reminders))
  }

  // 更新问答列表
  static async updateQaList () {
    const res = await ServeGetQas()
    const qaList = res.data.items
    log.info('获取的问答列表：' + JSON.stringify(qaList))
  }

  // 更新关键字
  static async updateKeywords () {
    const res = await ServeGetKeywords()
    const keywords = res.data.items
    log.info('获取的关键字：' + JSON.stringify(keywords))
  }

  // 更新进群欢迎语
  static async updateWelcomes () {
    const res = await ServeGetWelcomes()
    const welcomes = res.data.items
    log.info('获取的进群欢迎语：' + JSON.stringify(welcomes))
  }

}
