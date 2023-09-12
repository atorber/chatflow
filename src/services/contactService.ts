/* eslint-disable sort-keys */
import type { VikaBot } from '../db/vika-bot.js'

import { VikaSheet, IRecord } from '../db/vika.js'
import { Contact, Wechaty, log, types } from 'wechaty'
import { wait } from '../utils/utils.js'

// import { db } from '../db/tables.js'
// const contactData = db.contact
// log.info(JSON.stringify(contactData))

// 服务类
export class ContactChat {

  private db:VikaSheet
  vikaBot: VikaBot

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.contactSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getContact()
  }

  async getContact () {
    const records:IRecord[] = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 上传联系人列表
  async updateContacts (bot: Wechaty) {
    let updateCount = 0
    try {
      const contacts: Contact[] = await bot.Contact.findAll()
      log.info('当前微信最新联系人数量：', contacts.length)
      const recordsAll: any = []
      const recordExisting = await this.db.findAll()
      // log.info('云端好友数量：', recordExisting.length || '0')
      const wxids: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: IRecord) => wxids.push(record.fields['好友ID|id'] as string))
      }
      for (let i = 0; i < contacts.length; i++) {
        const item = contacts[i]
        const isFriend = item?.friend()
        // log.info('好友详情：', item?.name(), JSON.stringify(isFriend))
        if (item && isFriend && item.type() === types.Contact.Individual && !wxids.includes(item.id)) {
          // log.info('云端不存在：', item.name())
          let avatar = ''
          let alias = ''
          try {
            avatar = String(await item.avatar())
          } catch (err) {
            log.error('获取好友头像失败：', err)
          }
          try {
            alias = await item.alias() || ''
          } catch (err) {
            log.error('获取好友备注失败：', err)
          }
          const fields = {
            '备注名称|alias':alias,
            '头像|avatar':avatar,
            '是否好友|friend': item.friend(),
            '性别|gender': String(item.gender() || ''),
            '更新时间|updated': new Date().toLocaleString(),
            '好友ID|id': item.id,
            '好友昵称|name': item.name(),
            '手机号|phone': String(await item.phone()),
            '类型|type': String(item.type()),
          }
          const record = {
            fields,
          }
          recordsAll.push(record)
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        await this.db.insert(records)
        log.info('好友列表同步中...', i + 10)
        updateCount = updateCount + 10
        void await wait(1000)
      }

      log.info('同步好友列表完成，更新好友数量：', updateCount || '0')
    } catch (err) {
      log.error('更新好友列表失败：', err)

    }

  }

}
