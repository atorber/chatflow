/* eslint-disable sort-keys */
import { Contact, Wechaty, log } from 'wechaty'
import { delay, logger } from '../utils/utils.js'

import { ChatFlowConfig } from '../api/base-config.js'
import {
  ServeGetContactsRaw,
  ServeDeleteBatchContact,
  ServeCreateContactBatch,
} from '../api/contact.js'

// import { db } from '../db/tables.js'
// const contactData = db.contact
// logger.info(JSON.stringify(contactData))

// 服务类
export class ContactChat {

  static bot:Wechaty

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  // 初始化
  static async init () {
    this.bot = ChatFlowConfig.bot
    log.info('初始化 ContactChat 成功...')
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

}
