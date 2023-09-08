/* eslint-disable sort-keys */
import { db } from '../db/tables.js'
import type { VikaBot, TaskConfig } from '../db/vika-bot.js'
import { VikaSheet } from '../db/vika.js'
import { log } from 'wechaty'

const noticeData = db.notice

// 服务类
export class NoticeChat {

  private db:VikaSheet
  vikaBot: VikaBot
  envsOnVika: any
  roomWhiteList: any
  contactWhiteList: any
  reminderList: TaskConfig[] = []

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.noticeSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getRecords()
  }

  async getRecords () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取定时提醒
  async getTimedTask () {
    const taskRecords = await this.db.findAll()
    // log.info('定时提醒任务列表：\n', JSON.stringify(taskRecords))

    let timedTasks: TaskConfig[] = []

    interface TaskRecord {
      recordId: string;
      fields: {
        [key: string]: any;
      };
    }

    // 优化后的代码
    timedTasks = taskRecords.map((task: TaskRecord) => {
      const taskConfig: TaskConfig = {
        id: task.recordId,
        msg: task.fields['内容|desc'],
        time: task.fields['时间|time'],
        cycle: task.fields['周期|cycle'] || '无重复',
        targetType: task.fields['通知目标类型|type'] === '好友' ? 'contact' : 'room',
        target: task.fields['通知目标类型|type'] === '好友' ? { name: task.fields['昵称/群名称|name'], id: task.fields['好友ID/群ID(选填)|id'], alias: task.fields['好友备注(选填)|alias'] } : { topic: task.fields['昵称/群名称|name'], id: task.fields['好友ID/群ID(选填)|id'] },
        active: task.fields['启用状态|state'] === '开启',
      }

      if (taskConfig.active && taskConfig.msg && taskConfig.time && taskConfig.cycle && (task.fields['昵称/群名称|name'] || task.fields['好友ID/群ID(选填)|id'] || task.fields['好友备注(选填)|alias'])) {
        return taskConfig
      }

      return null
    }).filter(Boolean)
    // log.info('任务列表：', timedTasks)
    this.reminderList = timedTasks
    return this.reminderList
  }

}
