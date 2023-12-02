/* eslint-disable sort-keys */
import { VikaSheet, IRecord } from '../db/vika.js'
import { Room, Wechaty, log } from 'wechaty'
import { delay, logger } from '../utils/utils.js'
import { VikaDB } from '../db/vika-db.js'
import { BaseEntity, MappingOptions } from '../db/vika-orm.js'

import { ChatFlowConfig } from '../api/base-config.js'

// import { db } from '../db/tables.js'
// const roomData = db.room

const mappingOptions: MappingOptions = {  // 定义字段映射选项
  fieldMapping: {  // 字段映射
    id: '群ID|id',
    topic: '群名称|topic',
    ownerId: '群主ID|ownerId',
    updated: '更新时间|updated',
    avatar: '头像|avatar',
    file: '头像图片|file',

  },
  tableName: '群列表|Room',  // 表名
}

// 服务类
export class RoomChat extends BaseEntity {

  static db:VikaSheet
  static rooms: any[]
  static bot:Wechaty

  topic?: string  // 定义名字属性，可选

  id?: string

  alias?: string

  updated?: string

  avatar?: string

  file?: string

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected static override mappingOptions: MappingOptions = mappingOptions  // 设置映射选项为上面定义的 mappingOptions

  protected static override getMappingOptions (): MappingOptions {  // 获取映射选项的方法
    return this.mappingOptions  // 返回当前类的映射选项
  }

  static override setMappingOptions (options: MappingOptions) {  // 设置映射选项的方法
    this.mappingOptions = options  // 更新当前类的映射选项
  }

  // 初始化
  static async init () {
    this.db = new VikaSheet(VikaDB.vika, VikaDB.dataBaseIds.roomSheet)
    RoomChat.setVikaOptions({
      apiKey: VikaDB.token,
      baseId: VikaDB.dataBaseIds.roomSheet, // 设置 base ID
    })
    const rooms = await this.getRoom()
    this.rooms = rooms
    this.bot = ChatFlowConfig.bot

    log.info('初始化 RoomChat 成功...')
  }

  static async getRoom () {
    const records = await this.db.findAll()
    // logger.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 上传群列表
  static async updateRooms (puppet:string) {
    let updateCount = 0
    try {
      const rooms: Room[] = await this.bot.Room.findAll()
      log.info('最新微信群数量：', rooms.length)
      const recordsAll: any = []
      const recordExisting = await this.db.findAll()
      logger.info('云端群数量：' + recordExisting.length || '0')
      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: IRecord) => {
          if (record.fields['群ID|id']) {
            wxids.push(record.fields['群ID|id'] as string)
            recordIds.push(record.recordId)
          }
        })
      }

      if (puppet === 'wechaty-puppet-wechat' || puppet === 'wechaty-puppet-wechat4u') {
        const count = Math.ceil(recordIds.length / 10)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, 10)
          logger.info('删除：', records.length)
          await this.db.remove(records)
          await delay(1000)
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
            '头像|avatar':avatar,
            '群ID|id': item.id,
            '群主ID|ownerId': ownerId || '',
            '群名称|topic': await item.topic() || '',
            '更新时间|updated': new Date().toLocaleString(),
          }
          const record = {
            fields,
          }
          recordsAll.push(record)
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        try {
          await this.db.insert(records)
          logger.info('群列表同步完成...' + i + records.length)
          updateCount = updateCount + records.length
          void await delay(1000)
        } catch (err) {
          logger.error('群列表同步失败,待系统就绪后再管理群发送【更新通讯录】可手动更新...' + i + 10)
          void await delay(1000)
        }
      }

      logger.info('同步群列表完成，更新到云端群数量：' + updateCount || '0')
    } catch (err) {
      logger.error('更新群列表失败：' + err)

    }

  }

}
