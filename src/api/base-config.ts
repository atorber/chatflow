/* eslint-disable sort-keys */
import type { ProcessEnv } from '../types/mod.js'

import type {
  Wechaty,
} from 'wechaty'

import type { WhiteList } from '../services/mod.js'
import type { BusinessRoom, BusinessUser } from './contact-room-finder.js'
import type { BiTable } from '../db/lark-db.js'
import type {
  IClientOptions,
} from '../proxy/mqtt-proxy.js'
import CryptoJS from 'crypto-js'
import { ServeGetUserConfigObj } from '../api/user.js'

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
  contact?: Contact;
  room?:Room;
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

interface Room {
  topic: string;
  id: string;
}

interface Contact {
  name: string;
  alias: string;
  id: string;
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

  static switchsOnVika: any[]
  static reminderList: any[]
  static statisticRecords: any
  static configEnv : ProcessEnv
  static dataBaseType: 'vika'
  static spaceId: string
  static token: string = ''
  static adminRoomTopic?: string
  static endpoint?: string
  static bot:Wechaty
  static larkDB: BiTable

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

  static async init (options:{
    spaceId?:string,
    token?:string,
  }) {
    this.dataBaseType = 'vika'
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

}
