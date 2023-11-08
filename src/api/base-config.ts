/* eslint-disable sort-keys */
import type { ProcessEnv } from '../types/mod.js'
import type { IRecord } from '../db/vika.js'

import {
  log,
  Wechaty,
} from 'wechaty'

import type { WhiteList } from '../services/mod.js'
import type { BusinessRoom, BusinessUser } from '../plugins/finder.js'
import { VikaDB } from '../db/vika-db.js'
import type {
  IClientOptions,
} from '../proxy/mqtt-proxy.js'
import CryptoJS from 'crypto-js'

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
  pubTime?: string
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

  static envsOnVika: any[]
  static switchsOnVika: any[]
  static reminderList: any[]
  static statisticRecords: any
  static configEnv : ProcessEnv
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

  static bot:Wechaty

  static async init () {

    // log.info('初始化维格配置信息...,init()')

    if (VikaDB.spaceId) {
      const vikaIdMap: any = {}
      const vikaData: any = {}
      const configRecords: any[] = await VikaDB.getAllRecords(VikaDB.dataBaseIds.envSheet)
      for (let i = 0; i < configRecords.length; i++) {
        const record: IRecord = configRecords[i] as IRecord
        const fields = record.fields
        const recordId = record.recordId
        if (fields['标识|key']) {
          if (fields['值|value'] && [ 'false', 'true' ].includes(fields['值|value'])) {
            vikaData[record.fields['标识|key'] as string] = fields['值|value'] === 'true'
          } else {
            vikaData[record.fields['标识|key'] as string] = fields['值|value'] || ''
          }
          vikaIdMap[record.fields['标识|key'] as string] = recordId
        }
      }

      this.configEnv = vikaData
      const wechatyConfig: WechatyConfig = {
        puppet: this.configEnv.WECHATY_PUPPET,
        token: this.configEnv.WECHATY_TOKEN,
      }

      // 计算clientid原始字符串
      const clientString = this.configEnv.VIKA_TOKEN + this.configEnv.VIKA_SPACE_NAME
      // clientid加密
      const client = CryptoJS.SHA256(clientString).toString()

      const mqttConfig:IClientOptions = {
        username: this.configEnv.MQTT_USERNAME,
        password: this.configEnv.MQTT_PASSWORD,
        host: this.configEnv.MQTT_ENDPOINT,
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

      const mqttIsOn = Boolean(this.configEnv.MQTT_MQTTMESSAGEPUSH || this.configEnv.MQTT_MQTTCONTROL)

      // log.info('vikaBot配置信息：', JSON.stringify(configVika, undefined, 2))

      return {
        wechatyConfig,
        mqttConfig,
        mqttIsOn,
      }
    } else {
      log.error('\n\n指定空间不存在，请先创建空间，并在.env文件或环境变量中配置vika信息\n\n================================================\n')
      return undefined
    }
  }

}
