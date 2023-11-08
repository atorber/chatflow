/* eslint-disable sort-keys */
import { VikaSheet, IRecord } from '../db/vika.js'
import { Contact, Wechaty, log } from 'wechaty'
import { delay, logger } from '../utils/utils.js'
import { VikaDB } from '../db/vika-db.js'
import { ChatFlowConfig } from '../api/base-config.js'

// import { db } from '../db/tables.js'
// const contactData = db.contact
// logger.info(JSON.stringify(contactData))

// 服务类
export class ContactChat {

  static db:VikaSheet
  static bot:Wechaty = ChatFlowConfig.bot

  private constructor () {

  }

  // 初始化
  static async init () {
    this.db = new VikaSheet(VikaDB.vika, VikaDB.dataBaseIds.contactSheet)
    await this.getContact()
    log.info('初始化 ContactChat 成功...')
  }

  static async getContact () {
    const records:IRecord[] = await this.db.findAll()
    // logger.info('维格表中的记录：' + JSON.stringify(records))
    return records
  }

  // 上传联系人列表
  static async updateContacts (puppet:string) {
    let updateCount = 0
    try {
      const contacts: Contact[] = await this.bot.Contact.findAll()
      log.info('最新联系人数量(包含公众号)：', contacts.length)
      logger.info('最新联系人数量(包含公众号)：' + contacts.length)
      const recordsAll: any = []
      const recordExisting = await this.db.findAll()
      log.info('云端好友数量（不包含公众号）：', recordExisting.length || '0')
      logger.info('云端好友数量（不包含公众号）：' + recordExisting.length || '0')

      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: IRecord) => {
          wxids.push(record.fields['好友ID|id'] as string)
          recordIds.push(record.recordId)
        })
      }
      logger.info('当前bot使用的puppet:' + puppet)
      log.info('当前bot使用的puppet:', puppet)

      if (puppet === 'wechaty-puppet-wechat' || puppet === 'wechaty-puppet-wechat4u') {
        const count = Math.ceil(recordIds.length / 10)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, 10)
          log.info('删除：', records.length)
          await this.db.remove(records)
          await delay(1000)
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
      logger.info('好友数量：' + recordsAll.length || '0')
      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        await this.db.insert(records)
        logger.info('好友列表同步中...' + i + records.length)
        updateCount = updateCount + records.length
        void await delay(1000)
      }

      logger.info('同步好友列表完成，更新到云端好友数量：' + updateCount || '0')
    } catch (err) {
      logger.error('更新好友列表失败：' + err)

    }

  }

}
