/* eslint-disable sort-keys */
import { db } from '../db/tables.js'
import type { VikaBot } from '../db/vika-bot.js'

import { VikaSheet } from '../db/vika.js'
import { log } from 'wechaty'
import { wait } from '../utils/utils.js'
import type { RoomWhiteList, ContactWhiteList } from '../types/mod.js'
import type { BusinessRoom, BusinessUser } from '../plugins/finder.js'

const whiteListData = db.whiteList

// 服务类
export class WhiteListChat {

  private db:VikaSheet
  vikaBot: VikaBot
  envsOnVika: any
  roomWhiteList: any
  contactWhiteList: any

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.whiteListSheet)
    this.contactWhiteList = {
      qa: [],
      msg: [],
      act: [],
    }
    this.roomWhiteList = {
      qa: [],
      msg: [],
      act: [],
    }
    // void this.init()
  }

  // 初始化
  async init () {
    await this.getRecords()
  }

  async getRecords () {
    const records = await this.db.findAll()
    log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取白名单
  async getWhiteList () {
    const whiteList: { contactWhiteList: ContactWhiteList; roomWhiteList: RoomWhiteList } = { contactWhiteList: this.contactWhiteList, roomWhiteList: this.roomWhiteList }
    const whiteListRecords: any[] = await this.getRecords()
    await wait(1000)
    for (let i = 0; i < whiteListRecords.length; i++) {
      const record = whiteListRecords[i]
      const fields = record.fields
      const app: 'qa' | 'msg' | 'act' = fields['所属应用|app']?.split('|')[1]
      // log.info('当前app:', app)
      if (fields['昵称/群名称|name'] || fields['好友ID/群ID(选填)|id'] || fields['好友备注(选填)|alias']) {
        if (record.fields['类型|type'] === '群') {
          const room: BusinessRoom = {
            topic: record.fields['昵称/群名称|name'],
            id: record.fields['好友ID/群ID(选填)|id'],
          }
          this.roomWhiteList[app].push(room)

        } else {
          const contact: BusinessUser = {
            name: fields['昵称/群名称|name'],
            alias: fields['好友备注(选填)|alias'],
            id: fields['好友ID/群ID(选填)|id'],
          }
          this.contactWhiteList[app].push(contact)
        }
      }
    }

    whiteList.contactWhiteList = this.contactWhiteList
    whiteList.roomWhiteList = this.roomWhiteList
    return whiteList
  }

}
