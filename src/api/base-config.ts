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
import { ServeGetUserConfigObj } from '../api/user.js'

import { delay, logger } from '../utils/utils.js'
import {
  ServeGetContactsRaw,
  ServeDeleteBatchContact,
  ServeCreateContactBatch,
} from '../api/contact.js'

import {
  ServeGetGroupsRaw,
  ServeDeleteBatchGroups,
  ServeCreateGroupBatch,
} from '../api/room.js'

import { ServeGetKeywords } from '../api/keyword.js'

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
  room?:BusinessRoom;
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
  qaSheet:string
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
    const initPairs:[string, string][] = fields.map((fields:any) => {
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

export class ChatFlowConfig {

  static isLogin: boolean = false
  static isReady: boolean = false
  static switchsOnVika: any[]
  static reminderList: any[]
  static statisticRecords: any
  static configEnv : ProcessEnv
  static spaceId: string
  static token: string = ''
  static adminRoomTopic?: string
  static endpoint?: string
  static bot:Wechaty
  static db:{
    dataBaseIds: DateBase,
    dataBaseNames: DateBase,
    dataBaseIdsMap: {
      [key: string]: string;
    };
    spaceId: string,
    token: string,
  }

  static whiteList:WhiteList = {
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

  static async init (options:{
    spaceId?:string,
    token?:string,
  }) {
    ChatFlowConfig.spaceId = options.spaceId || ChatFlowConfig.spaceId
    ChatFlowConfig.token = options.token || ChatFlowConfig.token
    // log.info('初始化维格配置信息...,init()')
    const userConfig = await ServeGetUserConfigObj()
    // log.info('userConfig', JSON.stringify(userConfig))
    this.configEnv = userConfig.data
    const wechatyConfig: WechatyConfig = {
      puppet: this.configEnv.WECHATY_PUPPET,
      token: this.configEnv.WECHATY_TOKEN,
    }

    // 计算clientid原始字符串
    const clientString = ChatFlowConfig.token + ChatFlowConfig.spaceId
    // clientid加密
    const client = CryptoJS.SHA256(clientString).toString()

    const mqttConfig:IClientOptions = {
      username: this.configEnv.MQTT_USERNAME,
      password: this.configEnv.MQTT_PASSWORD,
      host: this.configEnv.MQTT_ENDPOINT,
      protocol:'mqtts',
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
  static async updateContacts (puppet:string) {
    let updateCount = 0
    try {
      const contacts: Contact[] = await this.bot.Contact.findAll()
      log.info('最新联系人数量(包含公众号)：', contacts.length)
      logger.info('最新联系人数量(包含公众号)：' + contacts.length)

      const recordsAll: any = []
      const recordRes = await ServeGetContactsRaw()
      const recordExisting = recordRes.data.items

      log.info('云端好友数量（不包含公众号）：', recordExisting.length || '0')
      logger.info('云端好友数量（不包含公众号）：' + recordExisting.length || '0')

      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((fields:any) => {
          wxids.push(fields['id'] as string)
          recordIds.push(fields.recordId)
        })
      }
      logger.info('当前bot使用的puppet:' + puppet)
      log.info('当前bot使用的puppet:', puppet)

      // 根据多维表格类型设置批量操作的数量和延迟时间
      const batchCount = ChatFlowConfig.token.indexOf('/') === -1 ? 10 : 100
      const delayTime = ChatFlowConfig.token.indexOf('/') === -1 ? 1000 : 500

      // 如果是wechaty-puppet-wechat或wechaty-puppet-wechat4u，每次登录好友ID会变化，需要分批删除好友
      if (puppet === 'wechaty-puppet-wechat' || puppet === 'wechaty-puppet-wechat4u') {
        const count = Math.ceil(recordIds.length / batchCount)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, batchCount)
          log.info('删除：', records.length)
          await ServeDeleteBatchContact({ recordIds:records })
          await delay(delayTime)
        }
        wxids = []
      }

      for (let i = 0; i < contacts.length; i++) {
        const item = contacts[i]
        const isFriend = item?.friend() || false
        // const isIndividual = item?.type() === types.Contact.Individual
        // logger.info('好友详情：' + item?.name())
        // log.info('是否好友：' + isFriend)
        // logger.info('是否公众号：' + isIndividual)
        // if(item) log.info('头像信息：', (JSON.stringify((await item?.avatar()).toJSON())))
        if (item && isFriend && !wxids.includes(item.id)) {
          // logger.info('云端不存在：' + item.name())
          let avatar:any = ''
          let alias = ''
          try {
            avatar = (await item.avatar()).toJSON()
            avatar = avatar.url
          } catch (err) {
            // logger.error('获取好友头像失败：'+ err)
          }
          try {
            alias = await item.alias() || ''
          } catch (err) {
            logger.error('获取好友备注失败：' + err)
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
      logger.info('待更新的好友数量：' + recordsAll.length || '0')

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
  static async updateRooms (puppet:string) {
    let updateCount = 0
    // 根据多维表格类型设置批量操作的数量和延迟时间
    const batchCount = ChatFlowConfig.token.indexOf('/') === -1 ? 10 : 100
    const delayTime = ChatFlowConfig.token.indexOf('/') === -1 ? 1000 : 500
    try {
      // 获取最新的群列表
      const rooms: Room[] = await this.bot.Room.findAll()
      log.info('最新微信群数量：', rooms.length)
      const recordsAll: any = []

      // 从云端获取已有的群列表
      const roomsRes = await ServeGetGroupsRaw()
      const recordExisting = roomsRes.data.items
      logger.info('云端群数量：' + recordExisting.length || '0')

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
          logger.info('删除：', records.length)
          await ServeDeleteBatchGroups({ recordIds:records })
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
            // logger.error('获取群头像失败：' + err)
          }
          const ownerId = await item.owner()?.id
          //   logger.info('第一个群成员：' + ownerId)
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
          logger.info('群列表同步完成...' + i + records.length)
          updateCount = updateCount + records.length
          void await delay(delayTime)
        } catch (err) {
          logger.error('群列表同步失败,待系统就绪后再管理群发送【更新通讯录】可手动更新...' + i + batchCount)
          void await delay(delayTime)
        }
      }

      logger.info('同步群列表完成，更新到云端群数量：' + updateCount || '0')
    } catch (err) {
      logger.error('更新群列表失败：' + err)

    }

  }

  // 获取关键字文案
  static async getKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.items

    let text :string = '【操作说明】\n'
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
    ChatFlowConfig.keywordList = records
    let text :string = '【操作说明】\n'
    for (const fields of records) {
      if (fields['type'] === '系统指令') text += `${fields['name']} : ${fields['desc']}\n`
    }
    return text
  }

}
