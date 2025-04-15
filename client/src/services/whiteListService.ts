/* eslint-disable sort-keys */
import { delay } from '../utils/utils.js'
import type { RoomWhiteList, ContactWhiteList } from '../types/mod.js'
import type { BusinessRoom, BusinessUser } from '../api/contact-room-finder.js'
import { ChatFlowCore } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'
import { ServeGetWhitelistWhite } from '../api/white-list.js'

// const whiteListData = ChatFlowCore.tables.whiteList

export type WhiteList = { contactWhiteList: ContactWhiteList; roomWhiteList: RoomWhiteList }

// 服务类
export class WhiteListChat {

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
    this.bot = ChatFlowCore.bot

    log.info('初始化 WhiteListChat 成功...')
  }

  // 获取白名单
  static async getWhiteList () {
    const whiteList: WhiteList = { contactWhiteList: this.contactWhiteList, roomWhiteList: this.roomWhiteList }
    const res = await ServeGetWhitelistWhite()
    const whiteListRecords: any[] = res.data.items
    await delay(1000)
    for (let i = 0; i < whiteListRecords.length; i++) {
      const fields = whiteListRecords[i]
      const app: 'qa' | 'msg' | 'act' | 'gpt' = fields['app']?.split('|')[1]
      // ChatFlowCore.logger.info('当前app:' + app)
      if (fields['name'] || fields['id'] || fields['alias']) {
        if (fields['type'] === '群') {
          const room: BusinessRoom = {
            topic: fields['name'],
            id: fields['id'],
          }
          this.roomWhiteList[app].push(room)

        } else {
          const contact: BusinessUser = {
            name: fields['name'],
            alias: fields['alias'],
            id: fields['id'],
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
