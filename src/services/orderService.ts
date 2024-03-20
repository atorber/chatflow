/* eslint-disable sort-keys */
import { delay, logger } from '../utils/utils.js'
import type { RoomWhiteList, ContactWhiteList } from '../types/mod.js'
import type { BusinessRoom, BusinessUser } from '../api/contact-room-finder.js'
import { ChatFlowCore } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'
import { ServeGetOrders } from '../api/order.js'

// const whiteListData = ChatFlowCore.tables.whiteList

export type WhiteList = { contactWhiteList: ContactWhiteList; roomWhiteList: RoomWhiteList }

// 服务类
export class OrderChat {

  static roomWhiteList: any
  static contactWhiteList: any
  static bot:Wechaty

  private constructor () {

  }

  // 初始化
  static async init () {
    this.contactWhiteList = {
      qa: [],
      msg: [],
      act: [],
      gpt: [],
    }
    this.roomWhiteList = {
      qa: [],
      msg: [],
      act: [],
      gpt: [],
    }
    await this.getRecords()
    this.bot = ChatFlowCore.bot

    log.info('初始化 WhiteListChat 成功...')
  }

  static async getRecords () {
    const res = await ServeGetOrders()
    const records = res.data.items
    logger.info('维格表中的记录：' + JSON.stringify(records))
    return records
  }

  // 获取白名单
  static async getWhiteList () {
    const whiteList: WhiteList = { contactWhiteList: this.contactWhiteList, roomWhiteList: this.roomWhiteList }
    const whiteListRecords: any[] = await this.getRecords()
    await delay(1000)
    for (let i = 0; i < whiteListRecords.length; i++) {
      const record = whiteListRecords[i]
      const fields = record.fields
      const app: 'qa' | 'msg' | 'act' | 'gpt' = fields['所属应用|app']?.split('|')[1]
      // logger.info('当前app:' + app)
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
    log.info('获取的最新白名单:' + JSON.stringify(whiteList))
    return whiteList
  }

}
